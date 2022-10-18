import { LightningElement } from 'lwc';
import getCurrentOnboardingRecordDetails from "@salesforce/apex/GetStepDetails.getCurrentOnboardingRecordDetails";
import cancel from '@salesforce/label/c.Cancel'
export default class DisplayClientOnboardingInfoInModal extends LightningElement {

    label = {
        cancel
    };
    isShowModal = false;
    finalMap = new Map();
    mapGateToLstTitleStatus = [];

    connectedCallback(){
        this.displayOnboardingDetails();
    }
    
    displayOnboardingDetails(){
        getCurrentOnboardingRecordDetails()
        .then(result => {            
            console.log('result ---> ' , result);
            let parsedData = JSON.parse(result);
            this.mapGateToLstTitleStatus = parsedData;


            // let stringifiedData = JSON.stringify(parsedData);
            // console.log('stringifiedData --->' , stringifiedData);
            // let finalData = JSON.parse(stringifiedData);
            // console.log('result obj---> ' , finalData);
            
            // finalData.forEach(eachRec => {
                
            //     this.mapGateToLstTitleStatus.push(eachRec);
                // let gate = eachRec.Gate__c;
                // let stepStatus = eachRec.Status__c;
                // let stepTitle = eachRec.Step_Title__c;
                
                // if(this.finalMap.get(gate) == undefined){
                //     console.log(this.finalMap.get(gate));
                //     this.finalMap.set(gate, []);
                // }
                
                // let lstTitleStatusArray = this.finalMap.get(gate);
                // lstTitleStatusArray.push(stepTitle, stepStatus);
                // this.finalMap.set(gate, lstTitleStatusArray);
                
            //});
            console.log('this.mapGateToLstTitleStatus---', this.mapGateToLstTitleStatus);
            // console.log('map created-->', this.finalMap);
            // this.mapGateToLstTitleStatus = Object.fromEntries(this.finalMap);
            // console.log('111', this.mapGateToLstTitleStatus);
            // console.log('222', JSON.stringify(this.mapGateToLstTitleStatus));
            // console.log('333', JSON.stringify(this.finalMap));
            
        })
        .catch(error => {
            console.error('**** error **** \n ',error)
        })
    }       

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }

}
