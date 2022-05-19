import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import { ToastrService } from 'ngx-toastr';
import {LoginComponent} from '../login/login.component';
import { Route,Router} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  // calling all chats when logged in 
  constructor(private http:HttpClient,private toastr: ToastrService,private loginComponent:LoginComponent,private router: Router) {

  }

  // initilaze socket
  ngOnInit(){
    this.http.get('http://34.227.27.35:9999/api/tasks').subscribe(
      (result) => {
        console.log("Task :", result)
        this.tasks = result
        this.task_list = Object.keys(this.tasks).map((key) => this.tasks[key]);
        console.log(this.task_list)
      })
  }
  tasks = {}
  task_list = []
  members_list = []

  onTask(data){
    console.log("Crete Task : ", data)
    data["created_by"] = localStorage.getItem("user")
    this.http.post('http://34.227.27.35:9999/api/create_task',data)
    .subscribe((result)=>{
      console.log(result)
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    (error)=>{
      console.log(error)
      this.toastr.error("Invalid Data");
    }
    )
  }

  showCheck(id){
    this.http.post('http://34.227.27.35:9999/api/status_update', {"id":id, "isCompleted": true})
    .subscribe((result)=>{
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      if (result["data"]===true){
        this.toastr.success("Task Finished, Good Job :)");
      }
      else{
        this.toastr.info("Task Pending...");
      }
    },
    (error)=>{
      console.log(error)
    }
    )
  }

  delete(id){
    this.http.delete('http://34.227.27.35:9999/api/delete/'+id)
    .subscribe((result)=>{
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      this.toastr.error("Task removed from list !");
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


