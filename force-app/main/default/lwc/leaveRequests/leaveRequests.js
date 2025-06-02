import { LightningElement, wire , api} from 'lwc';
import getLeaveRequests from '@salesforce/apex/LeaveRequstController.getLeaveRequests';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';
const COLUMNS =    [
{ label: 'Request Id', fieldName: 'Name' , cellAttributes: {class:{fieldName:'cellClass'}}},
{ label: 'From Date', fieldName: 'From_Date__c', cellAttributes: {class:{fieldName:'cellClass'}} },
{ label: 'To Date', fieldName: 'To_Date__c' , cellAttributes: {class:{fieldName:'cellClass'}}},
{ label: 'Reason', fieldName: 'Reason__c' , cellAttributes: {class:{fieldName:'cellClass'}}},
{ label: 'Status', fieldName: 'Status__c' , cellAttributes: {class:{fieldName:'cellClass'}}},
{ label: 'Manager Comment', fieldName: 'Manager_Comment__c' , cellAttributes: {class:{fieldName:'cellClass'}}},
{
    type :"button",
    typeAttributes: {
        label: "Edit",
        name: "Edit",
        title: "Edit",
        value: "Edit",
        disabled: {fieldName: 'isEditDisabled'}
    }, cellAttributes: {class:{fieldName:'cellClass'}}
    
}
];
export default class LeaveRequests extends LightningElement {
    columns = COLUMNS;
    leavesRequests = [];
    leavesRequestWireResult;
    showModalPopup = false; 
    objectApiName = 'LeaveRequest__c';
    recordId='';
    currentUserId = Id;
    @wire(getLeaveRequests)
    wiredMyLeaves(result) {
        this.leavesRequestWireResult = result;
        if (result.data) {
            this.leavesRequests = result.data.map(a => ({
                ...a,
                cellClass: a.Status__c === 'Approved' ? 'slds-theme_success' : a.Status__c === 'Rejected' ? 'slds-theme_warning' : '',
                isEditDisabled: a.Status__c != 'Pending'
            }));
        } else if (result.error) {
            console.error('Error occurred while fetching data:', result.error);
        }
    }
    get noRecordsFound() {
        return this.leavesRequests.length === 0;
    }
    newRequestClickHandler(){
        this.showModalPopup = true;
        this.recordId = '';
    }

    popupCloseHandler(){
        this.showModalPopup = false;
    }
    rowActionHandler(event){
        this.showModalPopup = true;
        this.recordId = event.detail.row.Id;
    }
    successHandler(event){
        this.showModalPopup = false;
        this.ShowToast('Data Saved Successfully');
        this.refreshGrid();
    }

    @api
    refreshGrid(){
                refreshApex(this.leavesRequestWireResult);


    }

    ShowToast(message, title='success',variant='success'){
        const event = new ShowToastEvent({
            title,
            message,
            variant
            });
            this.dispatchEvent(event);
        }
    }
