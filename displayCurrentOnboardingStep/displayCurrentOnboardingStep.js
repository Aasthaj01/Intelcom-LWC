import { LightningElement, track, wire, api} from 'lwc';
import getCurrentOnboardingStepDetails from "@salesforce/apex/GetStepDetails.getCurrentOnboardingStepDetails";
import currentStepRequirementsLabel from '@salesforce/label/c.CurrentStepRequirements'
export default class DisplayCurrentOnboardingStep extends LightningElement {
    
    onboardingStepTitle;
    onboardingStepInformation;
    objectApiName = 'Onboarding_Steps__c';

    label = {
        currentStepRequirementsLabel
    };

connectedCallback(){
    this.displayCurrentStepDetails();
}

displayCurrentStepDetails(){
    getCurrentOnboardingStepDetails()
    .then(result => {
        console.log('result ---> ' , result);
        let parsedData = JSON.parse(result);
        let stringifiedData = JSON.stringify(parsedData);
        let finalData = JSON.parse(stringifiedData);
        finalData.forEach(eachRec => {
            this.onboardingStepTitle = eachRec.Step_Title__c + ' :';
            if(eachRec.Step_Instructions__c){
                this.onboardingStepInformation = eachRec.Step_Instructions__c;        
            }
            else{
                this.onboardingStepInformation = '';
            }
        });

    })
    .catch(error => {
        console.error('**** error **** \n ',error)
    })
}       
    }
