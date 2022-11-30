var doTask = (taskName) => {
		console.log('\x1b[31m', "[TASK] STARTING: " + taskName ,'\x1b[0m');
		if(taskHistory.length == N) console.log('[EXE] Task count: ' + N + ' of ' + N)
			
		var begin=Date.now();
		return new Promise(function(resolve,reject){
			setTimeout(function(){
				var end= Date.now();
				var timeSpent=(end-begin)+ "ms";
				console.log('\x1b[36m', "[TASK] FINISHED: " + taskName + " in " +
					timeSpent ,'\x1b[0m');
				if(taskHistory.length == N) console.log('All done')
				
				resolve(true);
			},(Math.random()*200));
		});
	}

async function init(numberOfTasks) {
	const concurrencyMax = 4 ;
	const taskList = [...Array(numberOfTasks)].map(() =>
		[...Array(~~(Math.random() * 10 + 3))].map(() =>
		String.fromCharCode(Math.random() * (123 - 97) + 97)
		).join('') )
	const counter = 0;
	const concurrencyCurrent = 0
	console.log("[init] Concurrency Algo Testing...")
	console.log("[init] Tasks to process: ", taskList.length)
	console.log("[init] Task list: " + taskList)
	console.log("[init] Maximum Concurrency: ", concurrencyMax,"\n")
	
	await manageConcurrency(taskList,counter,concurrencyMax,concurrencyCurrent);
}

function manageConcurrency(taskList,counter,concurrencyMax,concurrencyCurrent){
	//event handling change concurrency limit on the fly
	if(counter == Math.floor(totalTaskNumber/ 2)){ //the case if task number = totalTaskNumber / 2 => change to N/ 2
		concurrencyMax = N / 2
		console.log('***** changing concurrency to ' + concurrencyMax + ' *****')
		
		//doTask if the current queue length exceeds new concurrenctMax limit
		while(tasksQueue.length > concurrencyMax){
			const task = tasksQueue.shift()
				doTask(task).then((result) => {
					concurrencyCurrent -= 1;
					manageConcurrency(taskList,counter,concurrencyMax,concurrencyCurrent);
					return result;
				})
			}
		concurrencyCurrent = concurrencyMax - 1
	}
	
	while (taskList.length && concurrencyCurrent < concurrencyMax && counter <= totalTaskNumber) {
		const task = taskList[0];
		taskList = taskList.slice(1);
		if(tasksQueue.indexOf(task) !== -1 || taskHistory.indexOf(task) !== -1){ return }
		
		concurrencyCurrent += 1;
		counter += 1
		console.log('[EXE] Concurrency: ' + concurrencyCurrent + ' of ' + concurrencyMax)
		console.log('[EXE] Task count: ' + taskHistory.length + ' of ' + totalTaskNumber)
		
		//record task history and concurrency queue for avoid repeated tasks processing
		taskHistory = [...taskHistory, task]
		tasksQueue = [...tasksQueue, task]
		
		
		doTask(task).then((result) => {
			concurrencyCurrent -= 1;
			tasksQueue.shift()
			manageConcurrency(taskList,counter,concurrencyMax,concurrencyCurrent);
			return result;
		})
    }
}

taskHistory = []
tasksQueue = []
totalTaskNumber = 20
N = 4
init(totalTaskNumber);