from rasa_nlu.training_data import load_data
from rasa_nlu.model import Trainer
from rasa_nlu import config

if __name__ == '__main__':
    training_data = load_data("C:/Users/divyangana.pandey/Desktop/RasaPoc/training/hpeBotTraining_rg.json")
    trainer = Trainer(config.load("C:/Users/divyangana.pandey/Desktop/RasaPoc/nlu_config/nlu_config.yml"))
    trainer.train(training_data)
    model_directory = trainer.persist('C:/Users/divyangana.pandey/Desktop/RasaPoc/model')
    print(model_directory)
