/*
* @author Aastha Luhadia, Salesforce.
* @date September 9th, 2022
* @description Apex class for fetching Onboarding Step Details. Onboarding Step is a custom object. 
*/

public without sharing class GetStepDetails {

    //Method used to fetch current logged in community user's contact id 
    public static String getCurrentLoggedInUserDetails(){
        id userId = UserInfo.getUserId();
        User u = [select id, contactId from User where id = : userId];
        String getContactId = u.contactId;
        system.debug('getContactId-->' + getContactId);
        return getContactId;
    }

    //Method used to fetch details of current onboarding step i.e step with status "In Progress" and has is to be shown to the client
    @AuraEnabled
    public static String getCurrentOnboardingStepDetails(){
    System.debug('Inside getCurrentOnboardingStepDetails method');
        try {
            List<Onboarding_Steps__c> onboardingStepList = new List<Onboarding_Steps__c>();
            String getContactId = getCurrentLoggedInUserDetails();
            system.debug('getContactId received-->' + getContactId);

             //will get only 1 record as a Client can have only 1 onboarding record
            List<Onboarding__c> onboardingRecIdLst= [select id, Contact__r.Id from Onboarding__c where Contact__r.Id=:getContactId];
            system.debug('current users onboarding rec-->' + onboardingRecIdLst);

            if(!onboardingRecIdLst.isEmpty()){
                system.debug('Inside if condition-->');
                onboardingStepList = [select id, Status__c, Step_Instructions__c, Step_Title__c, Show_Step_to_Client__c, Document_Link__c, Online_Form_Link__c from Onboarding_Steps__c WHERE Onboarding__r.Id=:onboardingRecIdLst[0].Id AND Status__c='In Progress' AND Show_Step_to_Client__c = True ORDER BY Step_Order__c ASC NULLS LAST LIMIT 1];
                system.debug('required onboarding step-->' + onboardingStepList);
                return JSON.serialize(onboardingStepList);
            }
            return null;
            

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
    }

    //Method used to fetch details of current onboarding record i.e gate, all the steps within the gates which are to be shown to the client along with their status
    @AuraEnabled
    public static String getCurrentOnboardingRecordDetails(){
    System.debug('Inside getCurrentOnboardingRecordDetails method');
        try {
            List<Onboarding_Steps__c> onboardingStepsList = new List<Onboarding_Steps__c>();
            List<Onboarding__c> onboardingRecIdLst = new List<Onboarding__c>();
            String getContactId = getCurrentLoggedInUserDetails();
            system.debug('getContactId received-->' + getContactId);
            
            //List<Map<String, List<List<String>>>> valueList = new List<Map<String, List<List<String>>>>();
            Map<String, List<OnboardingRecGateWrapper>> onboardingRecMap = new Map<String, List<OnboardingRecGateWrapper>>();
            //will get only 1 record as a Client can have only 1 onboarding record
            onboardingRecIdLst= [select id, Contact__r.Id from Onboarding__c where Contact__r.Id=:getContactId];
            system.debug('current users onboarding rec-->' + onboardingRecIdLst);

            if(!onboardingRecIdLst.isEmpty()){
                system.debug('Inside if condition-->');
                
                for(Onboarding_Steps__c ob : [select id, Status__c, Gate__c, Step_Title__c, Show_Step_to_Client__c, Step_Order__c from Onboarding_Steps__c WHERE Onboarding__r.Id=:onboardingRecIdLst[0].Id AND Show_Step_to_Client__c = True ORDER BY Gate__c, Step_Order__c ASC NULLS LAST]){
                    if(!onboardingRecMap.containsKey(ob.Gate__c)){
                        onboardingRecMap.put(ob.Gate__c, new List<OnboardingRecGateWrapper>());
                    }
                    
                    onboardingRecMap.get(ob.Gate__c).add(new OnboardingRecGateWrapper(ob.Step_Title__c, ob.Status__c, ob.Step_Order__c));
                }
            }
            
            List<OnboardingRecWrapper> obWrapperList = new List<OnboardingRecWrapper>();
            for(String key : onboardingRecMap.keySet()){
                obWrapperList.add(new OnboardingRecWrapper(key, onboardingRecMap.get(key)));
            }

            
            return JSON.serialize(obWrapperList);
            

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
    }
    
    public class OnboardingRecWrapper{
        private String gate;
        private List<OnboardingRecGateWrapper> values;

        public OnboardingRecWrapper(String gate, List<OnboardingRecGateWrapper> values){
            this.gate = gate;
            this.values = values;
        }
    }

    public class OnboardingRecGateWrapper{
        private String step;
        private String status;
        private Decimal orderNumber;

        public OnboardingRecGateWrapper(String step, String status, Decimal orderNumber){
            this.step = step;
            this.status = status;
            this.orderNumber = orderNumber;
        }
    }
}
