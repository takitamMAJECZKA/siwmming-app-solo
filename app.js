class Main{
    constructor(){
        this.state = []
        this.workouts_counter = 0;
        this.addWorkoutBtn = document.querySelector("#add-workout-button")
        this.workoutsWrapper = document.querySelector("#workouts-wrapper")
        this.addWorkoutBtn.addEventListener('click', () => {this.addWorkout()})
    }
    addWorkout(){
        this.state.push(new Workout(this.workouts_counter, this.workoutsWrapper));
        this.workouts_counter++;
    }

    convertToSecs(mmss){
        if(mmss != undefined){
            let mins = mmss.substring(0,2);
            let secs = mmss.substring(3,5);

            return parseInt(mins)*60 + parseInt(secs);
        }
    }

    convertToTime(s){
        let mins = parseInt(s/60)
        let secs = s%60

        return (mins<10 ? '0' + parseInt(mins) : parseInt(mins)) + ':' + (secs<10 ? '0' + parseInt(secs) : parseInt(secs))
    }
}

let App = new Main;


class Workout{
    constructor(number, parent){
        this.index = number;
        this.parent = parent;
        this.child_index = 0;
        this.workout;
        this.minsLong;
        this.metersLong;
        this.content = [];
        this.sourceCode =`
        <h3 class="name"">Workout Number ${this.index+1}</h3>
        <p class="info">000 min 000m</p>
        <button class="delete-button">X</button>
        <div class="measurement-wrapper">
        </div>
            <button class="measurement-button">Add measurement</button>
            <button class="break-button">Add break</button>`
        this.createWorkout()
    }

    createWorkout(){
        this.workout = document.createElement('div')
        this.workout.classList.add('workout')
        this.workout.setAttribute('id', `workout${this.index}`)
        this.workout.innerHTML = this.sourceCode;
        this.parent.prepend(this.workout)
        this.addListeners(this.workout)
    }

    addListeners(workout){
        this.measurementWrapper = workout.querySelector('.measurement-wrapper')
        workout.querySelector('.measurement-button').addEventListener('click', () => {this.content.push(new Measurement(this.measurementWrapper,this.child_index, this)); this.child_index++;})
        workout.querySelector('.break-button').addEventListener('click', () => {this.content.push(new Break(this.measurementWrapper,this.child_index,this)); this.child_index++;})
        workout.querySelector('.delete-button').addEventListener('click', () => {workout.remove()})
    }
    update(){
        this.minsLong = 0;
        this.metersLong = 0;
        for(let i = 0; i<this.content.length; i++){
            this.minsLong += App.convertToSecs(this.content[i].time)
            this.metersLong += this.content[i].distance;
        }
        this.minsLong = App.convertToTime(this.minsLong)
        this.workout.querySelector('.info').innerHTML = `${this.minsLong}min ${this.metersLong}m`
    }
}


class Measurement{
    constructor(workout, index, workoutObj){
        this.dad = workoutObj;
        this.measurement;
        this.index = index;
        this.poolsAmount;
        this.distance;
        this.time;
        this.sourceCode = `                
                <button class="m-delete-button">X</button>
                <p>Pools amount <input class="pools-amount" type="number"></p>
                <p>Time(MM:SS): <input class="time" type="text"></p>
                <p class="calculations">Distance(m):000     <br>      Pace (100m): 0000</p>
            `
        this.parent = workout;
        this.createMeasurement();
    }
    createMeasurement(){
        this.measurement = document.createElement('div')
        this.measurement.classList.add('measurement')
        this.measurement.setAttribute('id', `element${this.index}`)
        this.measurement.innerHTML = this.sourceCode;
        this.parent.append(this.measurement)
        this.addListeners()
    }
    addListeners(){
        this.measurement.querySelector('.m-delete-button').addEventListener('click', () => {this.measurement.remove()})
        this.measurement.querySelector('.pools-amount').addEventListener('change', () => {this.savePools()})
        this.measurement.querySelector('.time').addEventListener('change', () => {this.saveTime()})
    }
    savePools(){
        this.poolsAmount = this.measurement.querySelector('.pools-amount').value;
        this.distance = this.poolsAmount*25;
        this.saveAndUpdate();
    }
    saveTime(){
        this.time = this.measurement.querySelector('.time').value;
        this.saveAndUpdate();
    }
    saveAndUpdate(){
        this.measurement.innerHTML = `                
                <button class="m-delete-button">X</button>
                <p>Pools amount <input class="pools-amount" type="number"></p>
                <p>Time(MM:SS): <input class="time" type="text"></p>
                <p class="calculations">Distance(m): ${this.distance==undefined ? 0 : this.distance}     <br>      Pace (100m):${App.convertToTime(App.convertToSecs(this.time)/(this.distance/100)) == 'NaN:NaN' ? 0 : App.convertToTime(App.convertToSecs(this.time)/(this.distance/100))}</p>
            `
        this.dad.update()
        this.addListeners()
        }
}


class Break{
    constructor(workout, index, workoutObj){
        this.index = index;
        this.time;
        this.sourceCode = `      
                <button class="b-delete-button">X</button>
                <p>Break time: <input class="break-time" type="number"></p>
            `
        this.parent = workout;
        this.createBreak();
    }
    createBreak(){
        this.break = document.createElement('div')
        this.break.classList.add('break')
        this.break.setAttribute('id', `element${this.index}`)
        this.break.innerHTML = this.sourceCode;
        this.parent.append(this.break)
        this.break.querySelector('.b-delete-button').addEventListener('click', () => {this.break.remove()})
    }
}