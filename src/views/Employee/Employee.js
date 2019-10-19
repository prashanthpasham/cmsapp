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
import {FileUpload} from 'primereact/fileupload';
export default class Employee extends Component
{
    constructor(){
        super();
         this.state={
             designation:[],
             deptList:[],
             seldesignation:{},
             seldepartment:{},
             employeeCode:"",
             employeeName:"",
             joinedDate:"",
             workDetails:{
                 institute:"",
                 startYear:"",
                 endYear:""
             },
             workExperience:[],
             selectedRecord:"",
             currentDate:new Date()
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
    }
componentDidMount(){
    this.orgChart();
    this.departmentList();
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
    //alert(JSON.stringify(this.state.seldesignation));
    //alert(this.state.photo);
    if(this.state.employeeCode!=undefined && this.state.employeeCode.trim().length>0)
    {
        if(this.state.employeeName!=undefined && this.state.employeeName.trim().length>0)
        {
        if(Object.keys(this.state.seldesignation).length>0)
          {
            if(Object.keys(this.state.seldepartment).length>0)
            {
              
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
  this.setState({seldesignation: e.value});
//alert(JSON.stringify(e.value));
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
    data[property]=dd.getDate()+"/"+month+"/"+dd.getFullYear();
   }else
   data[property]=value;
  await this.setState({workDetails:data});
  //alert(JSON.stringify(this.state.workDetails));
  }
  addExperience(){
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
                   this.showSuccess("Work Experience Added Successfully!");
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
        this.setState({photo:e.target.result});
        }
        reader.readAsDataURL(input.target.files[0]);
      }
  }
render(){
    
    return (<div>
        <h1>Add Employee</h1>
        <Growl ref={(el) => this.growl = el} />
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
        <Calendar readOnlyInput="true" maxDate={this.state.currentDate} dateFormat="dd/mm/yy" value={this.state.joinedDate} onChange={(e) => this.setState({joinedDate: e.value})}></Calendar>
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
           
           <img width="200px" src={this.state.photo}  id="pic"  height="100px" ></img>
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
        <Calendar dateFormat="dd/mm/yy" readOnlyInput="true" maxDate={this.state.currentDate} value={this.state.workDetails.startYear} onChange={(e) => this.updateWorkData(e.target.value,'startYear')}></Calendar>
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
        <label>Terminated Date </label><br/>
        <Calendar readOnlyInput="true" dateFormat="dd/mm/yy" maxDate={this.state.currentDate} value={this.state.workDetails.endYear} onChange={(e) => this.updateWorkData(e.target.value,'endYear')}></Calendar>
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
            <Button label="Add" className="p-button-primary" onClick={()=>this.addExperience()} />
        </div>
        </div>
        </fieldset>
       </AccordionTab>
           </Accordion>
       </div>
          );
}

}