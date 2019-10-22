import React,{Component} from 'react';
import LoginService from '../../services/LoginService';
import {Dropdown} from 'primereact/dropdown';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Growl} from 'primereact/growl';
import {Button} from 'primereact/button';
import {Checkbox} from 'primereact/checkbox';
import {BrowserRouter as Router,Link,Switch,Route,Redirect} from 'react-router-dom';
import {Dialog} from 'primereact/dialog';
export default class EmployeeList extends Component
{
    constructor(props){
        super(props);
        this.state={
            employeeList:[],
            selectedEmp:{},
            deptList:[],
            designationList:[],
            visible:false,
            seldesignation:{},
            loading:'none',
           
        };
        this.onEmployee=this.onEmployee.bind(this);
        this.department=this.department.bind(this);
        this.employeeList=this.employeeList.bind(this);
        this.designationList=this.designationList.bind(this);
        this.operation=this.operation.bind(this);
       
    }
    async componentDidMount(){
      await this.designationList();
       await this.department();
       await this.employeeList();
    }
      designationList(){
         LoginService.designations(1).then(res=>{
            if(res!=undefined && res.hierarchy!=undefined){
            //alert(JSON.stringify(res));
            this.setState({designationList:res.hierarchy});
            
            }
        })
    }
    department(){
        LoginService.getAllClients("login/department/1",localStorage.getItem("token")).then(res=>{
            if(res!=undefined && res.department!=undefined){
              this.setState({deptList:res.department});
            }else{
              this.showError("Failed to fetch department records");
            }
          })
    }
    employeeList(){
        var emp={};
        emp.ownerId=1;
        LoginService.postServer("login/employee-list",localStorage.getItem("token"),emp).then(
            (res)=>{
             if(res!=undefined && res.result==="success"){
                res.employees.forEach((item)=>{
                     item.checked=false;
                     this.state.designationList.forEach(function(des){
                     if(item.designationId==des.id){
                         item.designation=des.label;
                     }
                     });
                 })
                 this.setState({employeeList:res.employees});
             }
            })
    }
   
    showSuccess(msg) {
        this.growl.show({severity: 'success', summary: 'Success', detail: msg});
    }
    showError(msg) {
        this.growl.show({severity: 'error', summary: 'Error', detail: msg});
    }
    async onEmployee(e){
    await this.setState({selectedEmp:e.data});
    alert(JSON.stringify(this.state.selectedEmp));
    }
    operation(type){
        var check = true;
        if(type==="edit"){
            if(Object.keys(this.state.selectedEmp).length==0){
                check=false;
                this.showError("Please Select Employee");
            }
        }
        if(check){
        console.log(JSON.stringify(this.state.selectedEmp));
        localStorage.setItem("type",type);
        localStorage.setItem("selectedEmp",JSON.stringify(this.state.selectedEmp));
        this.props.history.push("/dashboard/add-employee");
        }
    }
   
   
   
    render(){
        return(
            <div>
        <Growl ref={(el) => this.growl = el} />
           <h1>Employee List</h1>
          <Button label="Add" style={{padding:'5px',width:'100px',float:'right',marginRight:'25%',marginTop:'-20px'}} onClick={()=>this.operation('add')}/>
          <Button label="Edit" className="p-button-danger" style={{padding:'5px',width:'100px',float:'right',marginRight:'10px',marginTop:'-20px'}} onClick={()=>this.operation('edit')}/>
         
           <div className="content-section implementation" style={{width:'80%',marginTop:'50px'}}>
            
            <DataTable value={this.state.employeeList} paginator={true} rows={20}  responsive={true}
                               selectionMode="single" selection={this.state.selectedEmp} onSelectionChange={e => this.setState({selectedEmp: e.value})}
                               >
                       <Column selectionMode="single" style={{width:'4em'}}/>
                        <Column field="employeeCode" header="Employee Code" sortable={true} />
                        <Column field="employeeName" header="Employee Name" sortable={true} />
                        <Column field="designation" header="Designation" sortable={true} />
                        <Column field="deptName" header="Department" sortable={true} />
                        <Column field="status" header="Status" sortable={true} />
                        
                    </DataTable>
                    </div>
                    <img src="/22.gif" style={{display:`${this.state.loading}`,margin:'20%'}}/>
                    
            </div>
        );
    }
}