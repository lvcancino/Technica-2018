import logging
def getFileUuid(event):
    uuid = None; 
    filename = None;
    datum = event["datum"]
    #print(event)
    for key in datum:
        if "bbn" in key: #getting the right bbn
            uuid = datum[key]["uuid"]
            if ("baseObject" in datum[key]):
                if("properties" in datum[key]["baseObject"]):
                    if("map" in datum[key]["baseObject"]["properties"]):
                        if ("filename" in datum[key]["baseObject"]["properties"]["map"]):
                            filename = datum[key]["baseObject"]["properties"]["map"]["filename"]
    return uuid, filename





    
