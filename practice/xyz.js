const express = require('express');
const bodyParser = require('body-parser');
const{Semaphore} = require('async-mutex');
const {v4: uuidv4} = require('uuid');
class Poll{
    constructor(id, question, options){
        this.question = question;
        this.id = id;
        this.options = options.reduce((acc, option) => ({...acc,[option]:0}), {});
        
        this.createdAt = new Date();
        
    }
    updateQuestion(newquestion){
        this.question = newquestion;
    }
    
    updateOption(newOption){
        this.options = newOption.reduce((acc, option) => ({...acc, [option]:0}), {});
    }
    vote(option){
        if(this.option.hasOwnProperty(option)){
            this.options[option]++;
        }
    }
    getresult(){
        return {
            question: this.question,
            options:this.options,
            createdAt:this.createdAt,
        };
    }
}

class PollManager{
    constructor(){
        this.polls = {};
        this.queue =[];
        this.semaphore = new Semaphore(1);
        this.app = express();
        this.app.use(bodyParser.json());
        this.setupRoutes();
    }
    enqueueRequest(handler){
        return async(req, res)=>{
            this.queue.push({handler, req, res});
            this.processQueue();
        }
    }
    async processQueue(){
        if(this.queue.length===0){
            console.log("No");
            return;
        }
        
        const{handler, req, res} = this.queue.shift();
        await this.semaphore.runExclusive(() => handler(req, res));
        if(this.queue.length>0){
            this.processQueue();
        }
        
    }
    async createPoll(req, res){
        const {id, question, options}=req.body;
        if(!id || !question || !option ||!Array.isArray(options)){
            return res.status(400).send('Invalid')
        }
        this.polls[id] = new Poll(id, question, options);
        res.status(200).send('Poll done');
    }
    async updatePoll(req, res){
        const {id} = req.params;
        const {question, options} = req.body;
        if(!this.polls[id]){
            return res.status(404).send('Poll not found');
        }
        if(question){
            this.polls[id].updateQuestion(question);
        }
        if(options && Array.isArray(options)){
            this.polls[id].updateOption(options);
        }
        res.send("Poll updted");
    }
    
    async deletePoll(req, res){
        const {id} = req.params;
        if(!this.polls[id]){return res.status(404).send('Poll not found');
        }
        delete this.polls[id];
        res.send("poll deletd");
    }
    
    async voteInPoll(req, res){
        const {id} = req.params;
        const{option} = req.body;
        if(!this.polls[id]){return res.status(404).send('Poll not found');
        }
        this.polls[id].vote(option);
        res.send("poll voted");
    }
    
    async viewPollResults(req, res){
        const {id} = req.params;
        if(!this.polls[id]){return res.status(404).send('Poll not found');
        }
        res.json(this.polls[id].getresults());
    }
    
    setupRoutes(){
        this.app.post('/polls/:id', this.enqueueRequest(this.createPoll.bind(this)));
        this.app.put('/polls/:id', this.enqueueRequest(this.updatePoll.bind(this)));
        this.app.delete('/polls/:id', this.enqueueRequest(this.deletePoll.bind(this)));
        this.app.post('polls/:id', this.enqueueRequest(this.voteInPoll.bind(this)));
        this.app.get('polls/:id', this.enqueueRequest(this.viewPollResults.bind(this)));
    }
    
    start(port){
        this.app.listen(port, () =>{
            console.log(`PollManager running port ${port}`);
        })
    }
    
}
const pollManager = new PollManager();
pollManager.start(3000);
