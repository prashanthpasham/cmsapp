import React from 'react';
import {OrganizationChart} from 'primereact/organizationchart';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Growl} from 'primereact/growl';
import LoginService from '../../services/LoginService'; 
export default class OrganizationPortal extends React.Component{
constructor(){
    super();
    this.state = {
        visible: false,
        isAdd:false,
        isEdit:false,
        value:"",
        editVal:"",
        selectedNode:"",
        data:[],
        data1: [
                {
                    label: 'CTO',
                    id:'1.',
                    className: 'p-person',
                    expanded: true,
                    children:[{
                        label: 'Development',
                        className: 'department-cto',
                        expanded: true,
                        id:'1.1.',
                        children:[{
                            label: 'Analysis',
                            id:'1.1.1.',
                            className: 'department-cto',
                            children:[]
                        },
                        {
                            label: 'Front End',
                            id:'1.1.2.',
                            className: 'department-cto',
                            children:[]
                        },
                        {
                            label: 'Back End',
                            id:'1.1.3.',
                            className: 'department-cto',
                            children:[]
                        }]
                    },
                    {
                        label: 'QA',
                        id:'1.2.',
                        className: 'department-cto',
                        children:[]
                    },
                    {
                        label: 'R&D',
                        id:'1.3.',
                        className: 'department-cto',
                        children:[]
                    }]
                }
            ]
        ,
        selection: []
    };
    this.addHierarchy=this.addHierarchy.bind(this);
    this.addToOrganization=this.addToOrganization.bind(this);
    this.showSuccess=this.showSuccess.bind(this);
    this.showError=this.showError.bind(this);
    
}
componentDidMount(){
	LoginService.orgChartList(1).then(res=>{
	if(res!=undefined){
		console.log("hierarchy>>"+res.hierarchy);
		if(Object.keys(res.hierarchy).length>0){
		var hierarchy=[];
		hierarchy.push(res.hierarchy);
		this.setState({data:hierarchy});
		}
	}
	})
}

async onSelect(data){
    this.setState({visible:true,isAdd:false,isEdit:false})

await this.setState({selectedNode:data[0].id,editVal:data[0].label});

}
showSuccess(msg) {
    this.growl.show({severity: 'success', summary: 'Success', detail: msg});
}
showError(msg) {
    this.growl.show({severity: 'error', summary: 'Error', detail: msg});
}
hierarchy(){
    var obj={};
    obj.expanded= true;
    obj.label=this.state.value;
    obj.id="1.";
    obj.children=[];
    return obj;
}
firstNode(){
    this.setState({visible:true});
}
addHierarchy(){
    var check=true;
    if(this.state.isAdd && (this.state.value==undefined || this.state.value.toString().trim().length==0))
    {
        this.showError("Value Required!");
        check=false;
    }else if(this.state.isEdit && (this.state.editVal==undefined || this.state.editVal.toString().trim().length==0)){
        this.showError("Value Required!");
        check=false;
    }
    if(check){
   if(this.state.data.length==0)
   {
    if(this.state.isAdd){
    this.state.data.push(this.hierarchy());
    }else{
        this.state.data[0].label=this.state.editVal;
    }
   }else{
    this.state.data.map((node)=>{
        console.log(JSON.stringify(this.state.selectedNode));
        if(node.id===this.state.selectedNode){
            if(this.state.isAdd){
            var obj=this.hierarchy();
            obj.id=node.id+(node['children'].length+1)+".";
            node['children'].push(obj);
            }else{
                node.label=this.state.editVal;
            }
            return 1;
        }else
        this.addToOrganization(node,node['children']);
    });
}
    this.setState({visible:false});
    this.setState({value:""});
    this.showSuccess("Hierarchy "+(this.state.isAdd?" added":" edited")+" successfully!");
}
}
addToOrganization(node,data){
    console.log("id>>"+node.id+"@"+data);
    if(node.id===this.state.selectedNode && (data===undefined || data.length===0)){
        if(this.state.isAdd){
        var obj=this.hierarchy();
            obj.id=node.id+"1.";
            data.push(obj);
        }else{
            node.label=this.state.editVal;
        }
    }else{
    data.forEach((child)=>{
if(node.id===this.state.selectedNode){
    if(this.state.isAdd){
            var obj=this.hierarchy();
            obj.id=node.id+(data.length+1)+".";
            data.push(obj);
    }else{
        node.label=this.state.editVal;
    }
return 1;
}else{
    this.addToOrganization(child,child['children']);
}
    });
}

}
addDialog(){
    this.setState({isAdd:true,isEdit:false,value:""});

}
editDialog(){
    this.setState({isAdd:false,isEdit:true});
}
saveNode(){
	if(this.state.data.length===0){
		  this.showError("Organization Structure Required!");
	}else{
		var data={};
		data.hierarchy=this.state.data;
		data.ownerid=1;
		console.log("node>>"+JSON.stringify(data));
		LoginService.saveOrgChart(data).then(res=>{
           
			if(res!==undefined && res.result!==undefined && res.result==="success")
			 this.showSuccess("Saved Successfully!");
           else
	         this.showError("Some thing went Wrong,please try later!");
			});
	}
}
render(){
    return(
        <div>
               <Growl ref={(el) => this.growl = el} />
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>OrganizationChart</h1>
                    </div>
                </div>

                <div className="content-section implementation organizationchart-demo">
                
                   {this.state.data.length===0?
                   <Button style={{float:'left'}} label="Add Organization" onClick={()=>{this.firstNode()}}/>
                   : <div> <Button style={{float:'right',padding:'5px',marginRight:'15%',marginTop:'-20px',fontSize:'15px'}} label="Save" className="p-button-success" onClick={()=>{this.saveNode()}}/><br/>
				    <OrganizationChart value={this.state.data} nodeTemplate={this.nodeTemplate} selection={this.state.selection} selectionMode="multiple"
                        onSelectionChange={event => this.onSelect(event.data)} ></OrganizationChart></div>

    }
                </div>
                <Dialog header="Organization Structure" visible={this.state.visible} style={{width: '50vw'}} modal={true} onHide={() => this.setState({visible: false})}>
                <Button label="Add"  style={{marginLeft:'20px',width:'100px',padding:'5px'}} onClick={()=>{this.addDialog()}}/>
                <Button label="Edit" style={{display:`${this.state.data.length===0?'none':'block'}`,marginTop:'-45px',marginLeft:'180px',width:'100px',padding:'5px'}}
                className="p-button-danger"  onClick={()=>{this.editDialog()}}/>
                <fieldset style={{display:`${this.state.isAdd?'block':'none'}`}}>
                   <legend>Add</legend>
                   <InputText value={this.state.value} onChange={(e) => this.setState({value: e.target.value})} />
               <Button label="Add" className="p-button-success" style={{marginLeft:'20px',width:'100px',padding:'5px'}} onClick={()=>{this.addHierarchy()}}/>
               </fieldset>
               
               <fieldset style={{display:`${this.state.isEdit&&this.state.data.length>0?'block':'none'}`}}>
                   <legend>Edit</legend>
                   <InputText value={this.state.editVal} onChange={(e) => this.setState({editVal: e.target.value})} />
               <Button label="Edit" className="p-button-danger" style={{marginLeft:'20px',width:'100px',padding:'5px'}} onClick={()=>{this.addHierarchy()}}/>
               </fieldset>
                  </Dialog>
            </div>

    );
}
}
