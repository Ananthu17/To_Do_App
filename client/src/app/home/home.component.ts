import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import { ToastrService } from 'ngx-toastr';
import {LoginComponent} from '../login/login.component';
import { Route,Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  // calling all chats when logged in 
  constructor(private http:HttpClient,private toastr: ToastrService,private loginComponent:LoginComponent,private router: Router) {
      this.http.get('http://localhost:9999/api/tasks').subscribe(
      (result) => {
        console.log(result)
        this.tasks = result
        this.task_list = Object.keys(this.tasks).map((key) => this.tasks[key]);
        console.log(this.task_list)
      })

      this.http.get('http://localhost:9999/api/members').subscribe(
      (result) => {
        console.log(result)
        this.members = result
        this.members_list = Object.keys(this.members).map((key) => this.members[key]);
        console.log(this.members_list)
      })
  }

  // initilaze socket
  ngOnInit(){

  }
  tasks = {}
  task_list = []
  members = {}
  members_list = []

  onTask(data){
    console.log("Ananthu", data)
    this.http.post('http://localhost:9999/api/create_task',data)
    .subscribe((result)=>{
      console.log(result)
      window.location.reload();
    },
    (error)=>{
      console.log(error)
      this.toastr.error("Invalid Data");
    }
    )
  }

  onMemberAdd(data){
    console.log(data)
    this.http.post('http://localhost:9999/api/task_update',data)
    .subscribe((result)=>{
      console.log(result)
      window.location.reload();
      this.toastr.success("Task Updated Successfully");
    },
    (error)=>{
      console.log(error)
    }
    )
  }

  showCheck(id){
    console.log(id)
    this.http.post('http://localhost:9999/api/task_update',{"id":id, "isCompleted": true})
    .subscribe((result)=>{
      console.log(result)
      window.location.reload();
      this.toastr.success("Task Finished");
    },
    (error)=>{
      console.log(error)
    }
    )
  }

  logout(){
    localStorage.setItem('token',"")
    this.router.navigate(['login'])
  }
}

declare var $: any;
console.log(`jQuery version: ${$.fn.jquery}`);


