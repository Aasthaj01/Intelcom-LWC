import { LightningElement, track, wire, api} from 'lwc';
import getCurrentOnboardingStepDetails from "@salesforce/apex/GetStepDetails.getCurrentOnboardingStepDetails";
import currentStepRequiredFormsLabel from '@salesforce/label/c.Current_Step_Required_Forms'
import downloadForm from '@salesforce/label/c.DownloadForm'
import openOnlineForm from '@salesforce/label/c.OpenOnlineForm'
import domainUrl from '@salesforce/label/c.DomainUrl'
import { NavigationMixin } from 'lightning/navigation';

export default class DisplayCurrentStepDocs extends NavigationMixin(LightningElement) {
    
    downloadUrl;
    onlineFormBtn = true;
    downloadFormBtn = true;
    url;
    osDownloadableFile;
    osOnlineForm;
    label = {
        currentStepRequiredFormsLabel,
        downloadForm,
        openOnlineForm,
        domainUrl
    };

    connectedCallback(){
        this.displayCurrentStepRelatedDocs();
        }
    
    displayCurrentStepRelatedDocs(){
        getCurrentOnboardingStepDetails()
        .then(result => {
            console.log('result --- ' , result);
            let parsedData = JSON.parse(result);
            let stringifiedData = JSON.stringify(parsedData);
            let finalData = JSON.parse(stringifiedData);
            
            
            finalData.forEach(eachRec => {
                
                this.name = eachRec.Step_Title__c;
                this.osDownloadableFile = eachRec.Document_Link__c	;
                this.osOnlineForm = eachRec.Online_Form_Link__c; 
                var tempUrl=this.osDownloadableFile.split('/');
                this.downloadUrl=  domainUrl + '/sfc/servlet.shepherd/document/download/' + tempUrl[tempUrl.length-2];
            });
            console.log('this.downloadUrl', this.downloadUrl);
            
    
        })
        .catch(error => {
            console.error('**** error **** \n ',error)
        })
        .finally(()=>{
            this.checkIfUrlPresent();
        });
    }  

    // Navigation to new tab and display screen flow. 
    //If you want to show the flow in the same screen then remove GenerateUrl and use Navigate. Also remove .then
    navigateToWebPage() {
        if(this.osOnlineForm){
            console.log('Inside if part, online form link is there!');
            this[NavigationMixin.GenerateUrl]({
                "type": "standard__webPage",
                "attributes": {
                    "url": "/s"+this.osOnlineForm
                }
            }).then(url => {
                window.open(url, "_blank");
            });
        }
        else{
            console.log('Inside else part, no online form link!');
        }
        
    }

    handleClick(){
        let anchorTag = this.template.querySelector('a');
        anchorTag.setAttribute('href',this.text);
        anchorTag.setAttribute('download', this.name);
        anchorTag.innerText = 'Click for Text File!';
       
    }

    downloadClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: this.testVarUrl
            }
        }, false
    );
         
    }     

    checkIfUrlPresent(){
        if(!this.osOnlineForm && !this.osDownloadableFile){
            console.log('now going in checkIfUrlPresent function and checking osOnlineForm & osDownloadableFile value-->');
            this.onlineFormBtn = false;
            this.downloadFormBtn = false;
        }
        else if(!this.osDownloadableFile){
            console.log('now going in checkIfUrlPresent function and checking osDownloadableFile value-->');
            this.downloadFormBtn = false;
        }
        else if(!this.osOnlineForm){
            console.log('now going in checkIfUrlPresent function and checking osOnlineForm value-->');
            this.osOnlineForm = false;
        }

    }
        }
