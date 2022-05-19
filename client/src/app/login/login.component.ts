import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http:HttpClient , private router: Router ,private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  user=""
  showsignup(){
    console.log("ananthu");
    $('#card').addClass('d-none')
    $('#card-signup').removeClass('d-none')
  }
  showlogin(){
    console.log("nanthu");
    $('#card').removeClass('d-none')
    $('#card-signup').addClass('d-none')
  }
  attendance = {}

  onSubmit(data){
    console.log(data)
    this.http.post('http://34.227.27.35:9999/api/login',data)
    .subscribe((result)=>{
      console.log("nn",result)
      if(result["status"]==="ok"){
        localStorage.setItem('token',result["data"]["token"])
        localStorage.setItem('user',result["data"]["user"])
        this.toastr.success("Login Sucess..");
        setTimeout(() => {
          this.router.navigate(['home']);
        }, 2000);
      }
      else{
      this.toastr.error("Invalid username/password")
      }
    },
    (error)=>{
      console.log(error)
      this.toastr.error("Invalid Credentials");
    }
    )
  }

  onSignup(data){
    console.log(data)
    this.http.post('http://34.227.27.35:9999/api/register',data)
    .subscribe((result)=>{
      console.log(result)
      this.toastr.success("Account created successfully");
      $('#card').removeClass('d-none')
      $('#card-signup').addClass('d-none')
    },
    (error)=>{
      this.toastr.error("Invalid details..!");
    })
  }
  decoded_token(){
    const token_parts = this.attendance["token"].split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    console.log(token_decoded);
  }
}


declare var $: any;
console.log(`jQuery version: ${$.fn.jquery}`);

