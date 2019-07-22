# -*- coding: utf-8 -*-
"""
Created on Thu May 17 17:30:38 2018

@author: saswata.ranjan.nayak
"""

import json
import os
import numpy as np
from flask import Flask
from flask import request
from flask import make_response
import pandas as pd
from rasa_nlu.model import Interpreter
from flask_cors import CORS, cross_origin
import pandas as pd
from datetime import date
import pymongo
from pymongo import MongoClient

app = Flask(__name__)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/": {"origins": "http://localhost:90"}})

@app.route('/', methods=["GET", ])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])

def webhook_get_handler():
    """
    This Functions will keep on running when we run the App
    """
    user_msg = request.args.get('form')
    print(user_msg)
    interpreter = Interpreter.load("C:/Users/divyangana.pandey/Desktop/RasaPoc/model/default/model_20190711-123002")
    result = interpreter.parse(user_msg)
    print(result)
    entities = {}
    for entity in result['entities']:
        entities[entity['entity']] = entity['value']
    intent = result['intent']['name']
    #Call the Core Function
    res = makeWebhookResult(intent, entities)
    res = json.dumps(res, indent=4)
    r = make_response(res)
    r.headers['Content-Type'] = 'application/json'
    return r

num_format = lambda x: '${:,.2f}'.format(x)
def build_formatters(df, format):
    return {
        column:format
        for column, dtype in df.dtypes.items()
        if dtype in [ np.dtype('float64') ]
    }

def makeWebhookResult(intent, entities):
    global contractDF
    global accountDF
    chart = False
    chart_type = ""
    chart_display=""
    contract_df = contractDF
    account_df = accountDF
    if 'fyqtr' in entities.keys():
        if entities['fyqtr'] in ["current_qtr", "prev_qtr"]:
            entities['fyqtr'] = parse_qtr(entities['fyqtr'])
    if 'fyyear' in entities.keys():
        if entities['fyyear'] in ["current_fy", "prev_fy","next_fy"]:
            entities['fyyear'] = parse_year(entities['fyyear'])
    if intent == "greet":
        speech = "Hi, How can I help you today?"
    elif intent == "self_Desc":
        speech = "I am your virtual assistant developed by Accenture CDM Team. <br> To Know more about me please contact vinit.kumar.chandna@accenture.com"
    elif intent == "thank_You":
        speech = "Glad to help you. If you have any feedback for me, please contact vinit.kumar.chandna@accenture.com"
    elif intent == "target_nlg":
        global targetDF
        my_target_df = targetDF[targetDF['name'].apply(lambda name: name == "Saswat")]
        for index, row in my_target_df.iterrows():
            speech = "You are supposed to achieve : %s <br>Till Date you have done %s <br> You have opportunities waiting in your pipeline worth %s <br> %s more remaining to achieve your target "%('${:,.2f}'.format(row["target"]),'${:,.2f}'.format(row["achivedTillDate"]), '${:,.2f}'.format(row["oppInPipeline"]), '${:,.2f}'.format(row["target"]-row["achivedTillDate"]) )

    elif intent == "contract_Summary":
        speech =  "Here is the summary of the contract"
        grp_key = list()
        rename_key = list()
        if 'fyyear' in entities.keys():
            contract_df = contract_df[contract_df['FYYear'].apply(lambda fyyrr: fyyrr.lower() == entities['fyyear'].lower())]
            grp_key.append("FYYear")
            rename_key.append("Financial Year")
        if 'fyqtr' in entities.keys():
            contract_df = contract_df[contract_df['FYQtr'].apply(lambda fyqtr: fyqtr.lower() == entities['fyqtr'].lower())]
            grp_key.append("FYQtr")
            rename_key.append("FY Qtr")
        if 'productline' in entities.keys():
            contract_df = contract_df[contract_df['prodLineDesc'].apply(lambda productline: entities['productline'].lower() in productline.lower())]
            grp_key.append("prodLineDesc")
            rename_key.append("Product")
        if 'country' in entities.keys():
            contract_df = contract_df[contract_df['Country'].apply(lambda country: country.lower() == entities['country'].lower())]
            grp_key.append("Country")
            rename_key.append("Country")
        print("*********************** "+str(len(contract_df)))
        print(grp_key)
        rename_key.append("Contract Value")
        rename_key.append("# of Contracts")
        grp_df = contract_df.groupby(grp_key).sum().reset_index()
        grp_df.columns = rename_key
		#newDF = grp_df.to_json(orient='table')
		#dataToSendTemp = json.loads(newDF)
        formatters = build_formatters(grp_df, num_format)
        if len(grp_df) == 0:
            speech = "No Data found for your selection"
        else:
            speech = speech + ":" + "<br><br>" + grp_df.to_html(index=False, formatters=formatters)
			#speech = speech + "::" + "<br><br>" + dataToSendTemp
    elif intent == "opportunity_val_by_asset_status":
        if 'fyqtr' in entities.keys():
            account_df = account_df[contract_df['FYQtr'].apply(lambda fyqtr: fyqtr.lower() == entities['fyqtr'].lower())]
        if 'fyyear' in entities.keys():
            print("_______   "+entities['fyyear'].lower())
            account_df = account_df[contract_df['FYYear'].apply(lambda fyyear: fyyear.lower() == entities['fyyear'].lower())]
        grpByData = account_df.groupby("assetStatus").sum()[['Opportunity Value']]
        grpByData.reset_index(level=0, inplace=True)
        grpByData = grpByData.fillna(0)
        if len(grpByData) == 0:
            speech = "No Data found for your selection"
        else:
            speech = grpByData.to_dict('records')
            chart = True
            chart_display = 'Opportunity Value By Asset Status'
            chart_type = 'stackedbar'
    elif intent == "opportunity_salesstage_chart":
        if 'fyqtr' in entities.keys():
            account_df = account_df[contract_df['FYQtr'].apply(lambda fyqtr: fyqtr.lower() == entities['fyqtr'].lower())]
        grpByData = account_df.groupby("salesStage").sum()[['Opportunity Value']]
        grpByData.reset_index(level=0, inplace=True)
        grpByData = grpByData.fillna(0)
        speech = grpByData.to_dict('records')
        chart = True
        chart_display = 'Opportunity Value By SalesStage'
        chart_type = 'donut'
    else:
        speech = "Sorry, Didn't get that!!! <br>Can you please rephrase?"
    ret = {'speech': speech, 'chart': chart, 'Chart_Type': chart_type , 'chart_display': chart_display}
    print(ret)
    return ret

def parse_qtr(fyqtr):
    today = date.today()
    if fyqtr == "current_qtr":
        qtr_list = [1, 2, 3, 4]
        qtr_num = qtr_list[(today.month-1)//3]
    if fyqtr == "prev_qtr":
        qtr_list = [4, 1, 2, 3]
        qtr_num = qtr_list[(today.month - 1) // 3]
    ret = "FY"+str(today.year)[2:]+"Q"+str(qtr_num)
    print("****************************"+ret)
    return ret
def parse_year(fyyear):
    today = date.today()
    if fyyear == "current_fy":
        year = str(today.year)
    if fyyear == "prev_fy":
        year = str(today.year - 1)
    if fyyear == "next_fy":
        year = str(today.year + 1)
    print("****************************"+year)
    return year
if __name__ == '__main__':
    port = int(os.getenv('PORT', 70))
    print("Starting App on %d" % (port))
    username = Your UserName
    password = Your password
    host = Connection 
    mongoport = Your db port 
    db = DATABASE name
    mongo_uri = 'mongodb://%s:%s@%s:%s/%s' % (username, password, host, mongoport, db)
    targetDF = pd.read_csv("C:/Users/divyangana.pandey/Desktop/RasaPoc/targetSumm.csv")
    conn = MongoClient(mongo_uri)
    cndDB = conn[db]
    cursor1 = cndDB["BOT_ContractSample"].find({})
    cursor2 = cndDB["BOT_AccountSample"].find({})
    contractDF = pd.DataFrame(list(cursor1))
    accountDF = pd.DataFrame(list(cursor2))
    app.run(debug=True, port=port, host='0.0.0.0')
