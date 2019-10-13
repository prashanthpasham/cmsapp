import React,{Component} from 'react';
import LoginService from '../../services/LoginService';
import {Dropdown} from 'primereact/dropdown';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';
import {Accordion,AccordionTab} from 'primereact/accordion';
export default class Employee extends Component
{
    constructor(){
        super();
         this.state={
             designation:[],
             deptList:[],
             seldesignation:"",
             seldepartment:"",
             employeeCode:"",
             employeeName:"",
             joinedDate:""
         };
         
         this.addEmployee=this.addEmployee.bind(this);
         this.onDesignation=this.onDesignation.bind(this);
         this.departmentList=this.departmentList.bind(this);
         this.orgChart=this.orgChart.bind(this);
         this.onDepartment=this.onDepartment.bind(this);
    }
componentDidMount(){
    this.orgChart();
    this.departmentList();
}
orgChart(){
    LoginService.designations(1).then(res=>{
        if(res!=undefined && res.hierarchy!=undefined){
        //alert(JSON.stringify(res));
        this.setState({designation:res.hierarchy});
        }
    })
}
departmentList(){
    LoginService.getAllClients("login/department/1",localStorage.getItem("token")).then(res=>{
      if(res!=undefined && res.department!=undefined){
        this.setState({deptList:res.department});
      }else{
        this.showError("Failed to fetch department records");
      }
    })
}
addEmployee(){
    alert(JSON.stringify(this.state.seldesignation.label));
}
 onDesignation(e){
  this.setState({seldesignation: e.value});
//alert(JSON.stringify(e.value));
}
onDepartment(e){
    this.setState({seldepartment: e.value});
  //alert(JSON.stringify(e.value));
  }
render(){
    return (<div>
        <h1>Add Employee</h1>
        <div>
        <Button label="Save" style={{padding:'5px',marginRight:'20%',marginTop:'-50px',width:'100px',float:'right'}} className="p-button-primary" onClick={this.addEmployee}></Button>
        </div> 
        <div className="p-grid">
        <br/>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Employee Code *</label>
        <InputText value={this.state.employeeCode} onChange={(e) => this.setState({employeeCode: e.target.value})} />
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Employee Name *</label>
        <InputText value={this.state.employeeName} onChange={(e) => this.setState({employeeName: e.target.value})} />
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Designation *</label>
        <Dropdown value={this.state.seldesignation} options={this.state.designation} onChange={this.onDesignation } filter={true} filterPlaceholder="Search Designation" filterBy="label" optionLabel="label" placeholder="Designation"/>
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Department *</label>
        <Dropdown value={this.state.seldepartment} options={this.state.deptList} onChange={this.onDepartment } filter={true} filterPlaceholder="Search Department" filterBy="label" optionLabel="deptName" placeholder="Department"/>
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Joining Date </label>
        <Calendar dateFormat="dd/mm/yy" value={this.state.joinedDate} onChange={(e) => this.setState({joinedDate: e.value})}></Calendar>
        </div>
       </div>
       <Accordion   multiple={true} style={{width:'80%',marginTop:'20px'}}>
       <AccordionTab header="Work Experience" id="1">

       </AccordionTab>
           </Accordion>
       </div>
          );
}

}