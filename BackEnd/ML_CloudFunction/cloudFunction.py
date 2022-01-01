from google.cloud import storage
import requests
import json
from google.cloud import vision

def image_similarity(event, context):
    file = event
    bucket_name = "box-images"

    storage_client = storage.Client()
    blobs = storage_client.list_blobs(bucket_name)
    file_name = file['name']
    inputlabels = set(find_labels(file['name']))

    print('current image', file['name'], ' has labels: ', inputlabels)
    current_box_no = file_name.split('_')[1].split('.')[0]

    for blob in blobs:
        filename = blob.name

        print
        box_no = filename.split('_')[1].split('.')[0]

        if current_box_no == box_no:
            if filename != file['name']:
                labels_each = find_labels(filename)
                intersection_values = inputlabels.intersection(labels_each)

                print('The image', filename, ' has labels: ', labels_each)

                if len(list(intersection_values)) > 3:
                
                    blob.delete()
                    message = "Images are simiar in box number " + current_box_no

                    print(message)
                    url = "  https://us-central1-gold-cocoa-316817.cloudfunctions.net/pushmessages/pubsub"
                    params = {"status": "200", "message": message}
                  
                    headers = {'Content-type': 'application/json'}
                    r = requests.post(url, data=params)
                    
                    response = json.dumps(params)
                    print('response', r)

                    return response  
            
    print('end of function:::::')  

def find_labels(fn):
    client = vision.ImageAnnotatorClient()
    bucket_name = "box-images"
    image_uri = f"gs://{bucket_name}/{fn}"
    image = vision.Image()
    image.source.image_uri = image_uri
    response = client.label_detection(image=image)
    labels = response.label_annotations
    parts = []
    for label in labels:
        parts.append(label.description)
    return parts