from email.mime import image
import boto3
import base64
import os
from dotenv import load_dotenv

load_dotenv()

region='eu-central-1'

rekognition = boto3.client("rekognition", region,aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
         aws_secret_access_key= os.getenv('AWS_ACCESS_SECRET_KEY'))



def imgLabels(bytes):
     try:
          toImg=base64.b64decode(bytes)
          response = rekognition.detect_labels(Image={'Bytes': toImg})
          Labels=[]
          confidence=[]
          print(response['Labels'])
          for labels in response['Labels']:
               Labels.append(labels['Name'])
               confidence.append(labels['Confidence'])

          return Labels,confidence
     except Exception as e:
          print(e)
          return e


with open('database\990976.jpg','rb') as img:
     bb4=base64.b64encode(img.read())
print(imgLabels(bb4))
