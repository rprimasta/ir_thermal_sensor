import threading
import asyncio
import time
def create_thread_async_task(task_list):
    def callback(tasks):
        event_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(event_loop)
        # tasks = [
        #     asyncio.ensure_future(run_forever_task(synchronize_data,5)),
        #     asyncio.ensure_future(run_forever_task(task_push_database,3)),
        #     asyncio.ensure_future(run_forever_task(task_device_event,15)),
        #     asyncio.ensure_future(task_15min()),
        # ]
        event_loop.run_until_complete(asyncio.wait(tasks))
    t1 = threading.Thread(target=callback,args=[task_list])
    t1.daemon = True
    t1.start() 



def create_thread_standalone_task(task,sleep):
    def callback(task,sleep):
        while True:
            try:
                task()
                time.sleep(sleep) 
            except Exception as e:
                print("Error run thread_standalone_task :")
                print(e) 
    t1 = threading.Thread(target=callback,args=[task,sleep])
    t1.daemon = True
    t1.start() 
async def run_forever_task_2(task,sleep,doTaskFirst = True):
    start_time = time.time()
    if (doTaskFirst):
        await task()
    while True:
        try:
            if ((time.time() - start_time) >= sleep):
                print ("Scheduler Timer: ============================ %s" % (time.time() - start_time))

                await task()
                start_time = time.time()
            await asyncio.sleep(0.05)
        except Exception as e:
            print("Error run forever_task :")
            print(e) 

async def run_forever_task_executor(task,sleep,doTaskFirst = True):
    def callback(task_arg):
        loop = asyncio.new_event_loop()
        try:
            asyncio.set_event_loop(loop)
            return loop.run_until_complete(task_arg())
        finally:
            loop.close()
        
    if (doTaskFirst):
        #await event_loop.run_in_executor(None, callback, task)
        threading.Thread(daemon=True, target=callback,args=[task]).start() 
    start_time = time.time()
    while True:
        try:
            if ((time.time() - start_time) >= sleep):
                print ("Scheduler Timer: ============================ %s" % (time.time() - start_time))
                #await event_loop.run_in_executor(None, callback, task)
                threading.Thread(daemon=True, target=callback,args=[task]).start() 
                start_time = time.time()
            await asyncio.sleep(0.05)
        except Exception as e:
            print("Error run forever_task :")
            print(e) 


async def run_forever_task(task,sleep,doTaskFirst = True):
    while True:
        try:
            if (doTaskFirst):
                await task()
                await asyncio.sleep(sleep)
            else:
                await asyncio.sleep(sleep)
                await task()
        except Exception as e:
            print("Error run forever_task :")
            print(e) 

def run_task(task):
    loop = asyncio.get_event_loop()
    loop.run_until_complete(task())