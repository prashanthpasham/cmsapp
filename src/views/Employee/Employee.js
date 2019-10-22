import React,{Component} from 'react';
import LoginService from '../../services/LoginService';
import {Dropdown} from 'primereact/dropdown';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';
import {Accordion,AccordionTab} from 'primereact/accordion';
import {InputTextarea} from 'primereact/inputtextarea';
import {Growl} from 'primereact/growl';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Link,Redirect} from 'react-router-dom';


export default class Employee extends Component
{
    constructor(props){
        super(props);
         this.state={
             operationType:"add",
             loading:'block',
             designation:[],
             deptList:[],
             seldesignation:{},
             seldepartment:{},
             selStatus:{"label":"Active"},
             employee:{
                employeeCode:"",
                employeeName:"",
                joinedDate:"",
                designationId:0,
                deptId:0,
                photo:"",
             },
             
             workDetails:{
                 institute:"",
                 startYear:"",
                 endYear:""
             },
             workExperience:[],
             selectedRecord:"",
             currentDate:new Date(),
             statusList:[{"label":"Active"},{"label":"In active"},{"label":"Resigned"}],
             selectedreportingTo:{}
         };
         
         this.addEmployee=this.addEmployee.bind(this);
         this.onDesignation=this.onDesignation.bind(this);
         this.departmentList=this.departmentList.bind(this);
         this.orgChart=this.orgChart.bind(this);
         this.onDepartment=this.onDepartment.bind(this);
         this.updateWorkData=this.updateWorkData.bind(this);
         this.addExperience=this.addExperience.bind(this);
         this.deleteBtn=this.deleteBtn.bind(this);
         this.deleteWork=this.deleteWork.bind(this);
         this.myUploader=this.myUploader.bind(this);
         this.employee=this.employee.bind(this);
         this.onStatus=this.onStatus.bind(this);
         this.editEmployee=this.editEmployee.bind(this);
         this.back=this.back.bind(this);
         this.onReportingTo=this.onReportingTo.bind(this);
         this.reportingEmpList=this.reportingEmpList.bind(this);
    }
 async componentDidMount(){
     this.orgChart();
     
    
}
editEmployee(){
    if(localStorage.getItem("type")!=undefined && localStorage.getItem("type")==="edit")
    {
        this.setState({operationType:"edit"});
        var data=JSON.parse(localStorage.getItem("selectedEmp"));
        // alert(  localStorage.getItem("selectedEmp"));
        //alert(data.joinedDate);
         this.state.designation.forEach((des)=>{
             //console.log(JSON.stringify(des));
             if(des.id==data.designationId)
             {
                 
                 this.setState({seldesignation:des});
                 this.reportingEmpList();
             }
         })
         setTimeout(()=>{
         this.state.deptList.forEach((dept)=>{
            if(dept.deptId==data.deptId)
            {
                 this.setState({seldepartment:dept});
            }
        })
    },50);
        this.setState({employee:data,workExperience:data.workExperience});
    
    }
    this.setState({loading:'none'});
}
showSuccess(msg) {
    this.growl.show({severity: 'success', summary: 'Success', detail: msg});
}
showError(msg) {
    this.growl.show({severity: 'error', summary: 'Error', detail: msg});
}
 orgChart(){
    LoginService.designations(1).then(res=>{
        if(res!=undefined && res.hierarchy!=undefined){
        //alert(JSON.stringify(res));
            this.setState({designation:res.hierarchy});
            this.departmentList();
        
        }
    })
}
 departmentList(){
    LoginService.getAllClients("login/department/1",localStorage.getItem("token")).then(res=>{
      if(res!=undefined && res.department!=undefined){
         setTimeout(()=>{
            this.setState({deptList:res.department});
        },50);
        this.editEmployee();
      }else{
        this.showError("Failed to fetch department records");
      }
    })
}
addEmployee(){
    //alert(JSON.stringify(this.state.employee.joinedDate));
    //alert(this.state.photo);
    if(this.state.employee.employeeCode!=undefined && this.state.employee.employeeCode.trim().length>0)
    {
        if(this.state.employee.employeeName!=undefined && this.state.employee.employeeName.trim().length>0)
        {
        if(Object.keys(this.state.seldesignation).length>0)
          {
        
            if(Object.keys(this.state.seldepartment).length>0)
            {
              var employee=Object.assign({},this.state.employee);
           //   alert(employee.employeeId);
              employee.deptId=this.state.seldepartment.deptId;
              employee.designationId=this.state.seldesignation.id;
              alert(JSON.stringify(this.state.workExperience));
              employee['experienceDetails']=this.state.workExperience;
              employee['status']=this.state.selStatus.label;
              employee.ownerId="1";
              employee.createdUserName=localStorage.getItem("username");
              if(Object.keys(this.state.selectedreportingTo).length>0){
                if(this.state.selectedreportingTo.accessHr.trim().length==0)
                employee.accessHr= this.state.selectedreportingTo.employeeId+"@";
                else
                employee.accessHr= this.state.selectedreportingTo.accessHr;
                employee.reportingTo=this.state.selectedreportingTo.designationId;
              }
             
               LoginService.postServer("login/add-employee",localStorage.getItem("token"),employee) 
             .then(res=>{
                 if(res!=undefined && res.result==="success"){
                    if(this.state.operationType==="add")
                     this.showSuccess("Employee Saved Successfully!");
                     else
                     this.showSuccess("Employee Edited Successfully!");
                     //return <Redirect to="/dashboard/employee-list"/>;
                     setTimeout(()=>{  this.back() }, 1000);
                     
                 }else{
                    if(this.state.operationType==="add")
                     this.showError("Error in Saving Employee");
                     else
                     this.showError("Error in Updating Employee");
                 }
             })
          }else{
              this.showError("Department Required!");
          }
        
        }else{
            this.showError("Designation Required!");
        } 
            
        }else{
            this.showError("Employee Name Required!");
        }
        
    }else{
        this.showError("Employee Code Required!");
    }
}
 onDesignation(e){
//alert(JSON.stringify(e.value));
//this.setState({loading:'block'});
this.setState({seldesignation:e.value});
this.reportingEmpList();
}
reportingEmpList(){
    setTimeout(()=>{
        var emp={};
        emp.ownerId=1;
        emp.designation=0;
        this.state.designation.forEach((item)=>{
        if(item.hierarchy===this.state.seldesignation.parentNames){
            emp.designation=item.id;
        }
        });
        //emp.designation=this.state.seldesignation.id;
        //alert(JSON.stringify(emp));
        LoginService.postServer("login/employee-list",localStorage.getItem("token"),emp).then(
            (res)=>{
             if(res!=undefined && res.result==="success"){
                 //alert(JSON.stringify(res.employees));
               this.setState({reportingToEmps:res.employees});
               if(localStorage.getItem("type")!=undefined && localStorage.getItem("type")==="edit"){
               setTimeout(()=>{
                  
                   this.state.reportingToEmps.forEach((item)=>{
                  // alert(this.state.employee.reportingTo);
                       if(item.designationId===this.state.employee.reportingTo){
                          this.setState({selectedreportingTo:item});
                         // alert("item>>"+JSON.stringify(item));
                       }
                   });
               },50);
            }
               //this.setState({loading:'none'});
             }
         });
        },50);
}
onDepartment(e){
    this.setState({seldepartment: e.value});
  //alert(JSON.stringify(e.value));
  }
  async updateWorkData(value,property){
   var data= Object.assign({},this.state.workDetails);
   if(property!=='institute'){
    var dd=new Date(value);
    var month=dd.getMonth()+1;
    if(month<10)
        month="0"+month;
    data[property]=dd.getDate()+"-"+month+"-"+dd.getFullYear();
   }else
   data[property]=value;
  await this.setState({workDetails:data});
  //alert(JSON.stringify(this.state.workDetails));
  }
  addExperience(){
     // alert(this.state.workDetails.startYear);
      if(this.state.workDetails.institute==undefined
        || this.state.workDetails.institute.trim().length==0){
            this.showError("Institute Required!");
        }else if(this.state.workDetails.startYear==undefined
            || this.state.workDetails.startYear.trim().length==0){
                this.showError("Joined Date Required!");
            }
            else if(this.state.workDetails.endYear==undefined
                || this.state.workDetails.endYear.trim().length==0){
                    this.showError("Terminated Date Required!");
                }else{
                   var array= this.state.workExperience;
                   array.push(this.state.workDetails);
                   this.setState({workExperience:array});
                   var obj={
                    institute:"",
                    startYear:"",
                    endYear:""
                };
                   this.setState({workDetails:obj});
                   //this.showSuccess("Work Experience Added Successfully!");
                }
  }
 
  deleteBtn(){
    return <Button className="p-button-danger" label="Delete" onClick={()=>setTimeout(()=>{this.deleteWork()},1000)}/>;
  }
  deleteWork(){
    //alert(JSON.stringify(this.state.selectedRecord));
    var array=this.state.workExperience;
    for(var k=0;k< array.length;k++){
         if(array[k].institute===this.state.selectedRecord.institute)
         {
            
             array.splice(k,1);
          //return;
         }
     }
     //alert(array.length);
     this.setState({workExperience:array}); 
  }
  myUploader(input) {
    if (input.target.files && input.target.files[0]) {
        var reader = new FileReader();
        reader.onload=(e) =>{
        //this.setState({photo:e.target.result});
        this.employee(e.target.result,'photo');
        }
        reader.readAsDataURL(input.target.files[0]);
      }
  }
  async employee(e,type){
    var emp=Object.assign({},this.state.employee);
    if(type==="joinedDate"){
        var date=new Date(e);
        var mm=date.getMonth()+1;
        emp[type]=(date.getDate()<10?("0"+date.getDate()):date.getDate())+"-"+(mm<10?("0"+mm):mm)+"-"+date.getFullYear();
       // alert(emp[type]);
    }
    else
    emp[type]=e;
   
    await this.setState({employee: emp});
   // alert(JSON.stringify(this.state.employee));
  }
  onStatus(e){
    this.setState({selStatus:e.value});
  }
  onReportingTo(e){
    this.setState({selectedreportingTo:e.value});
  }
  back(){
      localStorage.removeItem("type");
      localStorage.removeItem("selectedEmp");
      this.props.history.push("/dashboard/employee-list");
  }
render(){
    
    return (<div>
        <img src="/22.gif" style={{display:`${this.state.loading}`,margin:'20%'}}/>
        <div style={{display:`${this.state.loading==='none'?'block':'none'}`}}>
        <h1>{this.state.operationType==="add"?"Add Employee":"Edit Employee"}</h1>
        <Growl ref={(el) => this.growl = el} />
        <div>
        <Button className="p-button-danger"  label="Back" style={{padding:'5px',width:'100px',float:'right',marginRight:'35%',marginTop:'-50px'}} onClick={()=>this.back()}/>
        <Button label="Save" style={{padding:'5px',marginRight:'20%',marginTop:'-50px',width:'100px',float:'right'}} className="p-button-primary" onClick={()=>this.addEmployee()}></Button>
        </div> 
        <div className="p-grid">
        <br/>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Employee Code *</label>
        <InputText value={this.state.employee.employeeCode} onChange={(e) => this.employee(e.target.value,'employeeCode')} />
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Employee Name *</label>
        <InputText value={this.state.employee.employeeName} onChange={(e) => this.employee(e.target.value,'employeeName')} />
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Status *</label>
        <Dropdown value={this.state.selStatus} options={this.state.statusList} onChange={this.onStatus } filter={true} filterPlaceholder="Search Status" filterBy="label" optionLabel="label" placeholder="Status"/>
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Designation *</label>
        <Dropdown value={this.state.seldesignation} options={this.state.designation} onChange={this.onDesignation } filter={true} filterPlaceholder="Search Designation" filterBy="label" optionLabel="label" placeholder="Designation"/>
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
                     <label>Reporting To </label>
                     <Dropdown value={this.state.selectedreportingTo} options={this.state.reportingToEmps} onChange={this.onReportingTo } filter={true} filterPlaceholder="Search Reporting To" filterBy="employeeName" optionLabel="employeeName" placeholder="Reporting To"/>
         </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Department *</label>
        <Dropdown value={this.state.seldepartment} options={this.state.deptList} onChange={this.onDepartment } filter={true} filterPlaceholder="Search Department" filterBy="label" optionLabel="deptName" placeholder="Department"/>
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Date of Joining </label>
        <Calendar readOnlyInput="true" maxDate={this.state.currentDate} dateFormat="dd-mm-yy"  value={this.state.employee.joinedDate} onChange={(e) => this.employee(e.target.value,'joinedDate')}></Calendar>
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        {this.state.employee.photo.length==0?
        <img width="200px" src="/no-image.jpg"  id="pic"  height="100px" ></img>
           :<img width="200px" src={this.state.employee.photo}  id="pic"  height="100px" ></img>}
           <input  type="file" onChange={(e)=>this.myUploader(e)}/>
        </div>
       </div>
       <Accordion   multiple={true} style={{width:'80%',marginTop:'20px'}}>
       <AccordionTab header="Work Experience" id="1">
       <DataTable value={this.state.workExperience} 
                               selectionMode="single" selection={this.state.selectedRecord} onSelectionChange={e => this.setState({selectedRecord: e.value})}
                               onRowSelect={this.onWorkSelect}>
                        <Column field="institute" header="Institute" sortable={true} />
                        <Column field="startYear" header="Joined Date" sortable={true} />
                        <Column field="endYear" header="Terminated Date" sortable={true} />
                        <Column header="Action" body={this.deleteBtn}/>
        </DataTable>
           <fieldset >
        <legend>Add Work Experience</legend>
        <div className="p-grid">
       <div className="p-col-12 p-md-6 p-lg-4">
        <label> Institute </label><br/>
        <InputTextarea value={this.state.workDetails.institute} onChange={(e) => this.updateWorkData(e.target.value,'institute')} />
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Joined Date</label><br/>
        <Calendar dateFormat="dd-mm-yy" readOnlyInput="true" maxDate={this.state.currentDate} value={this.state.workDetails.startYear} onChange={(e) => this.updateWorkData(e.target.value,'startYear')}></Calendar>
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Terminated Date </label><br/>
        <Calendar readOnlyInput="true" dateFormat="dd-mm-yy" maxDate={this.state.currentDate} value={this.state.workDetails.endYear} onChange={(e) => this.updateWorkData(e.target.value,'endYear')}></Calendar>
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
            <Button label="Add" className="p-button-primary" onClick={()=>this.addExperience()} />
        </div>
        </div>
        </fieldset>
       </AccordionTab>
           </Accordion>
       </div>
       </div>
          );
}

}