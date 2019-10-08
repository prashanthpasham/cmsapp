import React from 'react';
import {OrganizationChart} from 'primereact/organizationchart';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Growl} from 'primereact/growl';
export default class OrganizationPortal extends React.Component{
constructor(){
    super();
    this.state = {
        visible: false,
        value:"",
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

async onSelect(data){
    this.setState({visible:true})

await this.setState({selectedNode:data[0].id});

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
    if(this.state.value==undefined || this.state.value.toString().trim().length==0)
    {
        this.showError("Value Required!");
    }else{
   if(this.state.data.length==0)
   {
    this.state.data.push(this.hierarchy());
   }else{
    this.state.data.map((node)=>{
        console.log(JSON.stringify(this.state.selectedNode));
        if(node.id===this.state.selectedNode){
            var obj=this.hierarchy();
            obj.id=node.id+(node['children'].length+1)+".";
            node['children'].push(obj);
            return 1;
        }else
        this.addToOrganization(node,node['children']);
    });
}
    this.setState({visible:false});
    this.setState({value:""});
    this.showSuccess("Hierarchy added successfully!");
}
}
addToOrganization(node,data){
    console.log("id>>"+node.id+"@"+data);
    if(node.id===this.state.selectedNode && (data==undefined || data.length==0)){
        
        var obj=this.hierarchy();
            obj.id=node.id+"1.";
            data.push(obj);
    }else{
    data.forEach((child)=>{
if(node.id===this.state.selectedNode){

var obj=this.hierarchy();
            obj.id=node.id+(data.length+1)+".";
            data.push(obj);
return 1;
}else{
    this.addToOrganization(child,child['children']);
}
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
                {console.log(this.state.data)}
                   {this.state.data.length==0?
                   <Button style={{float:'left'}} label="Add Organization" onClick={()=>{this.firstNode()}}/>
                   : <OrganizationChart value={this.state.data} nodeTemplate={this.nodeTemplate} selection={this.state.selection} selectionMode="multiple"
                        onSelectionChange={event => this.onSelect(event.data)} ></OrganizationChart>

    }
                </div>
                <Dialog header="Organization Structure" visible={this.state.visible} style={{width: '30vw'}} modal={true} onHide={() => this.setState({visible: false})}>
               <fieldset>
                   <legend>Add</legend>
                   <InputText value={this.state.value} onChange={(e) => this.setState({value: e.target.value})} />
               <Button label="Add" style={{marginLeft:'20px',width:'100px',padding:'5px'}} onClick={()=>{this.addHierarchy()}}/>
               </fieldset>
               
                  </Dialog>
            </div>

    );
}
}
