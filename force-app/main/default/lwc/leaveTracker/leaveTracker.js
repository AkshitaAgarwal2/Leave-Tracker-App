import { LightningElement } from 'lwc';

export default class LeaveTracker extends LightningElement {
    refreshLeaveRequests(event){
        this.refreshLeaveRequests.myLeavesComp.refreshGrid();

    }
}