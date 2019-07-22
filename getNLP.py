from rasa_nlu.model import Interpreter
from rasa_nlu import config

interpreter = Interpreter.load("C:/Users/divyangana.pandey/Desktop/RasaPoc/model/default/model_20190617-221356")
user_msg="Can you tell me contract amount expiring in U.S.A"
result = interpreter.parse(user_msg)
print(result)
