import React,{Component} from 'react';
import {Button} from 'primereact/button';
import {Growl} from 'primereact/growl';
import {Dialog} from 'primereact/dialog';
import LoginService from '../../services/LoginService'; 
import {InputText} from 'primereact/inputtext';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
export default class Department extends Component
{
    constructor(){
        super();
        this.state={
             visible:false,
             deptList:[],
             deptCode:"",
             deptName:"",
             deptId:0,
             displayDialog:false,
             newDept:true
            
        };
        this.saveDept= this.saveDept.bind(this);
        this.departmentList=this.departmentList.bind(this);
    
        this.delete=this.delete.bind(this);
        this.onDeptSelect=this.onDeptSelect.bind(this);
    }
    componentDidMount(){
    this.departmentList();
    }
    showSuccess(msg) {
        this.growl.show({severity: 'success', summary: 'Success', detail: msg});
    }
    showError(msg) {
        this.growl.show({severity: 'error', summary: 'Error', detail: msg});
    }
    saveDept(){
       // alert(this.state.deptCode.trim().length);
      if(this.state.deptCode==undefined || this.state.deptCode.trim().length==0){
        this.showError("Department Code Required!");
      }else  if(this.state.deptName==undefined || this.state.deptName.trim().length==0){
        this.showError("Department Name Required!");
    }else{
        var department={};
        department.deptCode=this.state.deptCode;
        department.deptName=this.state.deptName;
        department.deptId=this.state.deptId;
        department.ownerId=1;
    LoginService.postServer("login/add-department",localStorage.getItem("token"),department).then((res)=>{
        if(res!=undefined){
            if(res.result==="success"){
            this.setState({deptCode:"",deptName:"",visible:false,deptId:0});
            this.showSuccess("Department added successfully!");
            this.departmentList();    
            }else{
                this.showError("Failed to save Department!");
            }
        }else{
            this.showError("Some thing went wrong,please try later.");
        }
          
    });
    }
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
    async onDeptSelect(e){
     await this.setState({
        newDept:false,
        visible:true,
        department: Object.assign({}, e.data)
    });
    //alert(JSON.stringify(this.state.selectedDept));
    this.setState({deptName:this.state.department.deptName
    ,deptCode:this.state.department.deptCode,deptId:this.state.department.deptId});
    }
  
    delete(){
     LoginService.getAllClients("login/delete-department/"+this.state.deptId,localStorage.getItem("token")).
     then(res=>{
         if(res!=undefined && res.result!=undefined){
          if(res.result==="success"){
              this.showSuccess("Deleted Successfully!");
              this.setState({deptCode:"",deptName:"",visible:false,deptId:0});
            this.departmentList();
          }else{
            this.showError("Failed to delete department!");
          }
         }else{
             this.showError("Some thing went wrong,please try later!");
         }
     })
    }
    render(){
        let header = <div className="p-clearfix" style={{lineHeight:'1.87em'}}>Department </div>;

        let footer = <div className="p-clearfix" style={{width:'100%'}}>
            <Button style={{float:'left'}} className="p-button-danger" label="Add" icon="pi pi-plus" onClick={()=>{this.setState({visible:true})}}/>
        </div>;

        let footer1 = <div className="ui-dialog-buttonpane p-clearfix">
                <Button label="Delete" icon="pi pi-times" onClick={this.delete} style={{display:`${this.state.newDept?'none':'block'}`}}/>
                <Button label="Save" icon="pi pi-check" onClick={this.save}/>
            </div>;
        return <div>
             <Growl ref={(el) => this.growl = el} />
           <h1>Department</h1>
            <Dialog header="Add Department" visible={this.state.visible} style={{width:'25vw'}}  modal={true} onHide={() => this.setState({visible: false})}>
            <div className="p-grid p-dir-col">
           
                  <div className="p-col-12">
                     <label>Department Code *</label><br/>
                     <InputText value={this.state.deptCode} onChange={(e) => this.setState({deptCode: e.target.value})} />
                  </div>
                  <div className="p-col-12">
                     <label>Department Name *</label><br/>
                     <InputText value={this.state.deptName} onChange={(e) => this.setState({deptName: e.target.value})} />
                  </div>
                  <div className="p-col-12">
                  <Button className="p-button-success" label="Add" style={{marginTop:'10px',padding:'0px',width:'100px'}} onClick={()=>this.saveDept()}></Button>
                  </div>
                  <div className="p-col-12">
                  <Button label="Delete" className="p-button-danger" icon="pi pi-times" onClick={this.delete} style={{display:`${this.state.newDept?'none':'block'}`}}/>
                  </div>
                  </div>
            
             </Dialog>
           <br/>
            <div className="content-section implementation" style={{width:'80%'}}>
            
            
            <DataTable value={this.state.deptList} paginator={true} rows={20}  header={header} footer={footer}
                               selectionMode="single" selection={this.state.selectedDept} onSelectionChange={e => this.setState({selectedDept: e.value})}
                               onRowSelect={this.onDeptSelect}>
                        <Column field="deptCode" header="Department Code" sortable={true} />
                        <Column field="deptName" header="Department Name" sortable={true} />
                        
                    </DataTable>
                    </div>
        </div>
    }
}