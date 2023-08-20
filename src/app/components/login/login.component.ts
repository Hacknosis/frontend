import { AccountService } from '@app/services'
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService
    ) {
        // redirect to home if already logged in
        if (this.accountService.userValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    Swal.fire("Login Success", "You will be directed to dashboard", "success").then(r => {
                      // get return url from query parameters or default to home page
                      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                      this.router.navigateByUrl(returnUrl);
                    });
                },
                error: res => {
                    Swal.fire('There was an error:', res.error.errors[0], 'error');
                    this.loading = false;
                }
            });
    }

    //Toggle menu functions
    selectedOption: string | null = null;
    isToggled: boolean = false;

    selectOption(option: string) {
        this.selectedOption = option;
        this.isToggled = false;
    }
    toggleMenu(): void {
        this.isToggled = !this.isToggled;
    }
    clickedOutside(): void {
        this.isToggled = false;
    }
}
