#!/usr/bin/python
import sys
import numpy 
import lazy_read_json as lj
import parse_entry as pe
import pythonJSon as pj
import json 
import os.path 
import logging
import re
from random import randint
from collections import Counter
logger = logging.getLogger(__name__)
import threading
import numpy as np

#offset = 280891928115
offset = 280890000000
MIN = 1261000000000 + offset
Day = 86400000 * 4
#mod = 7202696
modDay = 86400000

#0 to 3
def getTimeOfDay(me, slots):
    byfour = modDay/slots
    me = me % modDay
    count = 0
    noKill = True
    while(noKill):
        me = me - byfour
        if(me <= 0):
            return count
        else:
            count = count + 1



#for domain sockets IPCObject of type pathname, the socket is bound to a file and theia has path of file in property map 
def getdata():
    hash_label = {}
    no = {}
    data = []
    sol= []
    #mysum = 0
    dataobjs = pj.get_sample_data()
    for obj in dataobjs:
        print("obj", obj)
        print(obj["url"])
        label = obj["url"].split(".")[1]
        sol.append(label)
        count = 0
        if label not in hash_label:
            no[count] = label
            count = count + 1
            hash_label[label] = 1
        #else:
            #hash_label[label] = hash_label[label] + 1
        #mysum = mysum + int((obj["lastVisitTime"] - MIN)%mod)
        pixel = [getTimeOfDay(int(obj["lastVisitTime"]), 10)]  
        data.append(pixel)

    return data, sol, hash_label, no

def naive_num_prob(y_tr):
    numdict = Counter(y_tr)
    pis = np.zeros(10)
    for y in range(10):
        pis[y] = np.random.rand()
    pis = pis/pis.sum()
    return pis

def train_thetas(x_train, x_test, y_train, y_test, total, has,no) :
    
    #TODO FIX 
    print("X trsin", x_train)
    print("toal, ", total)
    thetas = np.zeros(total)
    # The value thetas[c,d,m] is the P(x_d = m | y = c) for a datapoint (x,y)
    # The value pis[c] = P(y = c)
    for i in range(len(x_train)):
        thetas[has[y_train[i]]] = thetas[has[y_train[i]]] + 1
        print(x_train[i])
        print(thetas[y_train[i]])
        #for image in indices: 
            #thetas[y, 0, x_train[image][0]] = thetas[y, 0, x_train[image][0]] + 1
        #thetas[y, 0, :] = thetas[y, 0, :] + 1/ (len(indices) + array[0] + 1)
    return thetas


def predict(x, thetas, pis):
    print("TH: ", thetas)
    logprobs = np.zeros(10)
    for y in range(10):
        logprobs[y] += np.log(pis[y])
        for d in range(1):
            if(thetas[y,d,x[d]] == 0):
                print(x)
                thetas[y,d,x[d]] = 0.00009
            logprobs[y] += np.log(thetas[y,d,x[d]])
    return np.argmax(logprobs)

def check_predictions(thetas, pis):
    correct_predictions = [
        predict(x_test, thetas, pis)
    ]
    print(correct_predictions)

data, sol, hash_label, no = getdata()
total = len(hash_label)
x_train = data[:int((len(data)/2))]
x_test = data[int((len(data)/2)) - 1:]
y_train = sol[:int((len(sol)/2))]
y_test = sol[(int((len(sol)/2)) + 1):]
pisi = naive_num_prob(y_train)
y_train = sol[:int((len(sol)/2))]
print("Y TRAIN: ", y_train)
print("SOL", sol)
#numpotentiallabels, #params, #param values (splittting the day into quarters)
array = [len(hash_label), 1, 4]
th = train_thetas(x_train, x_test, y_train, y_test, total, no)
check_predictions(th, pisi)



