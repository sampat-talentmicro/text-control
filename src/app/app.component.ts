import { OnInit, ViewChild } from "@angular/core";
import { Component, VERSION } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
// import { saveDocument } from "../assets/js/custom.js";
import { fromEvent } from "rxjs";
declare const saveDocumentAsPdf: any;
declare const saveDocumentAsdoc: any;
declare const saveDocumentAsHtml: any;
declare const TXTextControl: any;
declare const readDocument: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  username = "lokesh";
  place = "pune";
  date = "29-06-1989";
  isUserNameFieldExist = false;
  editor = false;
  receivedData: any;
  placeholders = [
    "username",
    "applicantcertification",
    "applicantcommunicationlevel",
    "applicantdob",
    "applicanteducation",
    "applicantemailid",
    "applicantexpectedsalary",
    "applicantexpectedsalarysf",
    "applicantexperience",
    "applicantfathername",
    "applicantfirstname",
    "applicantfullname",
    "applicantfunctionalarea",
    "applicantgender",
    "applicantindustry",
    "applicantinterestedurl",
    "applicantjobtitle",
    "applicantkeyskills",
    "applicantlastname",
    "applicantmiddlename",
    "applicantmobilenumber",
    "applicantnotinterestedurl",
    "applicantnoticeperiod",
    "applicantoriginalcvdownload",
    "applicantoriginalcvfilename",
    "applicantoriginalcvlink",
    "applicantpgcollege",
    "applicantpgeducation",
    "applicantpgmode",
    "applicantpgspecialization",
    "applicantpgtiertypeofcollege",
    "applicantpguniversity",
    "applicantpgyop",
    "applicantpgpercentage"
  ];

  constructor(private route: ActivatedRoute,
  ) {

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const encodedData = params['data'];
      if (encodedData) {
        const decodedData = decodeURIComponent(encodedData);
        this.receivedData = JSON.parse(decodedData);
        console.log(this.receivedData); // Output the received data
        Object.keys(this.receivedData).forEach(k => {
          this[k] = this.receivedData[k];
        })

        // this.placeholders = Object.keys(this.receivedData);
        console.log(this.placeholders)
      }
    });
    // window.addEventListener('message', (event) => {
    //   if (event.origin !== window.origin) {
    //     return;
    //   }

    //   const receivedData = event.data;
    //   console.log(receivedData); // Handle received data
    // });
  }

  onClickSave(prop) {

    const source = fromEvent(TXTextControl, "textFieldChanged");
    source.subscribe((f: any) => {
      // if(f.textField.name === 'username') {
      //   this.username = f.textField.text;
      // }

      console.log("changes");
    });

    if (!this.isUserNameFieldExist) {
      TXTextControl.formFields.addTextFormField(1000, f => {
        this.isUserNameFieldExist = true;
        f.setText(this[prop]);
        f.setName(prop);
      });
    } else {
      TXTextControl.formFields.forEach(formField => {
        formField.getName(formFieldName => {
          if (formFieldName === prop) {
            formField.setText(this[prop]);
          }
        });
      });
    }
  }

  openDocument(e: any) {
    this.readDocument(e);
    TXTextControl.enableCommands();

    TXTextControl.addEventListener("textFieldEntered", function (e) {
      TXTextControl.sendCommand(
        TXTextControl.Command.EditMode,
        TXTextControl.EditMode.Edit
      );
    });

    TXTextControl.addEventListener("textFieldLeft", function (e) {
      TXTextControl.sendCommand(
        TXTextControl.Command.EditMode,
        TXTextControl.EditMode.ReadAndSelect
      );
    });
  }

  readDocument(input: any) {
    if (input.target.files && input.target.files[0]) {
      var fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        var streamType = TXTextControl.streamType.PlainText;

        // set the StreamType based on the lower case extension
        switch (
        input.target.value
          .split(".")
          .pop()
          .toLowerCase()
        ) {
          case "doc":
            streamType = TXTextControl.streamType.MSWord;
            break;
          case "docx":
            streamType = TXTextControl.streamType.WordprocessingML;
            break;
          case "rtf":
            streamType = TXTextControl.streamType.RichTextFormat;
            break;
          case "htm":
            streamType = TXTextControl.streamType.HTMLFormat;
            break;
          case "tx":
            streamType = TXTextControl.streamType.InternalUnicodeFormat;
            break;
          case "pdf":
            streamType = TXTextControl.streamType.AdobePDF;
            break;
        }

        // load the document beginning at the Base64 data (split at comma)
        TXTextControl.loadDocument(streamType, e.target.result.split(",")[1]);
        TXTextControl.sendCommand(
          TXTextControl.Command.EditMode,
          TXTextControl.EditMode.ReadAndSelect
        );

      };

      // read the file and convert it to Base64
      fileReader.readAsDataURL(input.target.files[0]);
    }
  }

  async setInputs(item, placeholder) {

    await new Promise(resolve => {
      item.find(`{{${placeholder}}}`, 0, 0, r => {
        console.log(r);
        if (r > -1) {
          try {
            TXTextControl.selection.setText("");
            TXTextControl.selection.setStart(r, () => {
              console.log(r)
              TXTextControl.formFields.addTextFormField(1000, f => {
                console.log(f)
                if (f) {
                  this.isUserNameFieldExist = true;
                  f.setText(this[placeholder]);
                  f.setName(placeholder);
                  resolve(placeholder);
                  // Hide the find and replace dialog
                  try {
                    console.log(TXTextControl)

                  }
                  catch (err) {
                    console.log(err)
                  }
                }
                else {
                  resolve(placeholder);
                  // Hide the find and replace dialog
                  try {
                    console.log(TXTextControl)

                  }
                  catch (err) {
                    console.log(err)
                  }
                }

              });
            });
          }
          catch (err) {
            resolve(placeholder);
          }
        }
        else {
          resolve(placeholder);
        }



      });
    })

  }

  bind() {

    TXTextControl.textParts.forEach(async (item, i) => {
      if (item.find && i === 0) {
        for (let i = 0; i < this.placeholders.length; i++) {
          await this.setInputs(item, this.placeholders[i]);
        }

        this.editor = true;
      }
    });

    TXTextControl.getSubTextParts(function (r) {
      console.log(r)
    })

    TXTextControl.getTextParts(function (r) {
      console.log(r)
    })

    TXTextControl.getText(function (r) {
      console.log(r)
    })
  }

  async setViewerInputs(item, placeholder) {
    await new Promise(resolve => {
      item.find(`{{${placeholder}}}`, 0, 0, r => {
        TXTextControl.selection.setText(this[item]);
        resolve("done")
      });
    })

  }

  bindViewer() {
    TXTextControl.textParts.forEach(async (item, i) => {
      if (item.find && i === 0) {
        for (let i = 0; i < this.placeholders.length; i++) {
          await this.setViewerInputs(item, this.placeholders[i]);
        }
      }
    });
  }

  // NO star->https://storage.googleapis.com/ezeone/icanrefer/cc5b7133-3722-40c9-b110-63371d29d55e.png
  // 1 star->https://storage.googleapis.com/ezeone/icanrefer/5940f743-f679-45e1-9dba-8f1fcb6f9c47.png
  // 2 star->https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png
  // 3 star->https://storage.googleapis.com/ezeone/icanrefer/10c48d52-e65d-40b7-a731-a30755bad15d.png
  // 4 star->https://storage.googleapis.com/ezeone/icanrefer/5eeca1c5-af34-4c2b-98e8-2473432e2cfa.png
  // 5 star->https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png

  onClickLoad() {
    this.loadDocument();
  }

  onChangeLoad(event: any) {

    readDocument(event);
  }

  onClickSaveAsPdf() {
    saveDocumentAsPdf();
  }

  onClickSaveAsdoc() {
    saveDocumentAsdoc();
  }

  onClickSaveAshtml() {
    saveDocumentAsHtml();
  }
  loadDocument() {
    TXTextControl.loadDocument(
      TXTextControl.StreamType.HTMLFormat,
      btoa(
        `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Software Developer CV</title>
    <link
        href="https://fonts.googleapis.com/css2?family=Montagu+Slab:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }

        .container {
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h3,
        h2 {
            margin-top: 0px;
            margin-bottom: .5rem;
        }

        h5,
        h6 {
            margin: 0px .5rem;
        }

        p,
        ul,
        li {
            margin: 0px;
            font-size: 13px;
        }
    </style>
</head>

<body>
    <div class="container">
    <div style='text-align:right'>
    <img  id="resumeViewer" frameborder="0" style="width: 80px; height: 40px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/6068f27a-e72f-4e96-90ba-ada65ce350b1.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&amp;X-Goog-Credential=478594593338-74uha9dmfejgd8nt1d7hm01d72tbj6or%40developer.gserviceaccount.com%2F20240502%2Fauto%2Fstorage%2Fgoog4_request&amp;X-Goog-Date=20240502T115215Z&amp;X-Goog-Expires=3540&amp;X-Goog-SignedHeaders=host&amp;X-Goog-Signature=659485032904c9f5cfe1c30e8801a4d90c74c8fe0f36153ef000bb644b875da2409610ad90a3ea36641481c344d307e12768daf779ca10d17de473ff8d9b2f613e98e44f162643229a918769df5e53d9d259a57c5cf4d28b44174b8f068dd710ca29a7bda2279c9afdd34b2c2880984ae3bd54aff0fb672c5fb2df0989c71f01e8e8c4026c2abc4ef510dc10e54d9c0fb0503c7da9a049dad395c01e10ad1d99e717acd15fe363c31d0a0197c3a0847c178cc1b9660b68f79b98187d44597f8f5d038a1697246588e69eb33114b1c700029c322498e0b86ded527895279709a24566086d8862032076fbf15f0ef4904fe89c2e21900dbed841dcb048f7eeb24c" title="demo-logo2.png" class="ng-star-inserted">
    </div>
        <header>
            <h3>Ashish Gupta</h3>
            <p>Software Developer</p>
            <p>Email: uzairj46@gmail.com | Phone: +971527875808 | Location: Dubai,Uae</p>
        </header>
        <hr>
        <div class="section">
            <h3>Summary</h3>
            <p>Full Stack Developer with 3+ years experience in web & mobile app development. Skilled in front-end
                (HTML,
                CSS, JS, Angular, React, React Native) & back-end (Node,Express.js). Passionate about creating
                user-friendly,
                high-quality applications. Always up-to-date on latest trends & best practices.</p>
        </div>
        <div class="section">
            <h3>Skills</h3>
            <p>Java,Angular,Script writing</p>
        </div>

        <div class="section">
            <h3>Skills</h3>
            <table width="100%" >
            <thead>
            <tr>
                  <th>
                      Skill
                  </th>
                  <th>
                      Level
                  </th>
                  <th>
                      Experience
                  </th>
                  <th>
                      Status
                  </th>
            </tr>
            </thead>

            <tbody>
                  <tr>
                  <td>Java</td>
                  <td> <img  id="resumeViewer" frameborder="0" style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/5eeca1c5-af34-4c2b-98e8-2473432e2cfa.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td>3Year</td>
                  <td>Active</td>
                  </tr>
            </tbody>
            </table>
        </div>
        <div class="section">
            <h3>Experience</h3>
            <h5>Frontend Developer</h5>
            <h6>Banke International Properties | Sep 2022 - Present (1 year 8 months)</h6>
            <ul>
                <li>
                    Front End Developer at Banke International in Dubai
                    *BankeNow web & mobile app for property listings, leasing, buying & selling
                    *ERP web app with HRMS, recruitment & CRM functionalities
                    *Improved design for existing systems with better UI/UX
                    *Collaborated with team, translated designs to code & integrated front-end with back-end
                    *Delivered high-quality results meeting client requirements & exceeding user expectations
                </li>

            </ul>
        </div>

    </div>
</body>

</html>
`
      )
    );
  }

  loadDocument1() {
    TXTextControl.loadDocument(
      TXTextControl.StreamType.HTMLFormat,
      btoa(
        `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Software Developer CV</title>
    <link
        href="https://fonts.googleapis.com/css2?family=Montagu+Slab:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
    *{
      margin:0px;
      padding:0px;
    }
       .details{
        margin-bottom:5px; 
       }

       h3{
        font-size:17px;
       }
       
       th,tr{
        text-align:left;
        padding:3px;
       }
      
    </style>
</head>

<body style="font-family:Verdana;font-size:14px">
      <div class="main">
         <div class="section">

         


         <div class="image" style="width:100%;text-align:center">
         <img  id="resumeViewer" frameborder="0" style="width: 80px; height: 80px;border-radius:50px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/6068f27a-e72f-4e96-90ba-ada65ce350b1.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&amp;X-Goog-Credential=478594593338-74uha9dmfejgd8nt1d7hm01d72tbj6or%40developer.gserviceaccount.com%2F20240502%2Fauto%2Fstorage%2Fgoog4_request&amp;X-Goog-Date=20240502T115215Z&amp;X-Goog-Expires=3540&amp;X-Goog-SignedHeaders=host&amp;X-Goog-Signature=659485032904c9f5cfe1c30e8801a4d90c74c8fe0f36153ef000bb644b875da2409610ad90a3ea36641481c344d307e12768daf779ca10d17de473ff8d9b2f613e98e44f162643229a918769df5e53d9d259a57c5cf4d28b44174b8f068dd710ca29a7bda2279c9afdd34b2c2880984ae3bd54aff0fb672c5fb2df0989c71f01e8e8c4026c2abc4ef510dc10e54d9c0fb0503c7da9a049dad395c01e10ad1d99e717acd15fe363c31d0a0197c3a0847c178cc1b9660b68f79b98187d44597f8f5d038a1697246588e69eb33114b1c700029c322498e0b86ded527895279709a24566086d8862032076fbf15f0ef4904fe89c2e21900dbed841dcb048f7eeb24c" title="demo-logo2.png" class="ng-star-inserted">
         </div>
              <h2 style="text-align:center">TAUFEEQ SYED</h2>

              <table style="border:2px solid white;" class="details">
              <tr>
              <th style="border:2px solid white;">Mobile Number</th>
              <th style="border:2px solid white;">WA Mobile Number</th>
              </tr>
              <tr>
              <td style="border:2px solid white;">+91 9876545678</td>
              <td style="border:2px solid white;">+91 4568987643</td>
              </tr>
              <tr>
              <th style="border:2px solid white;">Email Id</th>
              <th style="border:2px solid white;">Date of Birth</th>
              </tr>
              <tr>
              <td style="border:2px solid white;">taufeeqme@gmail.com</td>
              <td style="border:2px solid white;">04-Mar-1992</td>
              </tr>
              <tr>
              <th style="border:2px solid white;">Preferred Location</th>
              <th style="border:2px solid white;">Preferred Location</th>
              </tr>
              <tr>
              <td style="border:2px solid white;">Dubai, United Arab Emirates</td>
              <td style="border:2px solid white;">Dubai, United Arab Emirates</td>
              </tr>
              <tr>
              <th style="border:2px solid white;">Experience</th>
              <th style="border:2px solid white;">Current CTC</th>
              </tr>
              <tr>
              <td style="border:2px solid white;">6 Years</td>
              <td style="border:2px solid white;">INR 5000000 per Annum</td>
              </tr>
              <tr>
              <th style="border:2px solid white;">Expected CTC</th>
              <th style="border:2px solid white;">Nationality</th>
              </tr>
              <tr>
              <td style="border:2px solid white;">INR 15000000 per annum</td>
              <td style="border:2px solid white;">Indian</td>
              </tr>
              <tr>
          
              <th style="border:2px solid white;">Passport Number</th>
          
              <th style="border:2px solid white;">Passport Issue Date</th>
              </tr>
              <tr>
          
              <td style="border:2px solid white;">87643247897</td>
              <td style="border:2px solid white;">4-jan-1999</td>
              </tr>
              <tr>
              <th style="border:2px solid white;">Passport Expiry Date</th>
              <th style="border:2px solid white;">ECR/ECNR</th>
              </tr>
              <tr>
          
              <td style="border:2px solid white;">23-Mar-2000</td>
              <td style="border:2px solid white;">ECNR</td>
              </tr>
              <tr>
              <th style="border:2px solid white;">Preffered Job Types</th>
              <th style="border:2px solid white;"></th>
              </tr>
              <tr>
              <td style="border:2px solid white;">Full Time - Regular, Full Time Contract, Campus Placement</td>
              <td style="border:2px solid white;"></td>
              </tr>
              </table>

              

              
             
              <div  class="education">
              <h3 style="margin-top:15px;color:rgb(100, 104, 127)">Education</h3>
               
                 <p style="margin:4px 0px 0px 0px;font-size:15px">PH.D. in High Energy Physics - .Net Certifications(76%)</p>
                 <p style="margin-left:0px;font-size:14px">Govt Eng College Gandinagar(RTU)</p>
                 <p style='color:grey;margin:2px 0px 0px 0px;font-size:14px'>Apr-2022 - Apr-2024</p>
                 
              </div>

              <div class="training">
              <h3 style="color:rgb(100, 104, 127);margin-top:15px">Training and Certification</h3>
              <ul>
              <li style="margin-left:20px;padding:4px">8th rank in university during 6th semester</li>
              <li style="margin-left:20px;padding:4px">Six Sigma green Belt from Motorola, USA during 2023</li>
              </ul>
              </div>

              <div class="career">
              <h3 style="margin-top:10px;color:rgb(100, 104, 127)">Career Objectives</h3>
              <p>To be the leader in marketing driven by digital and social media marketing for the global industry. Like to thrive in the competitive space with
                hardwork, dedication and integrity to help the branding organization where i get involved</p>
              </div>

              <div class="work">
              <h3 style="margin-top:10px;color:rgb(100, 104, 127)">Work Experience</h3>
              <p style="margin:4px 0px 0px 0px;font-size:17px">Senior Software Engineer</p>
              <p style='color:grey;margin:2px 0px 0px 0px;font-size:14px'>Apr-2024 - Apr-2024</p>
              <p style='margin:2px 0px 0px 0px;font-size:15px'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>

             
              <p style="margin:15px 0px 0px 0px;font-size:17px">Senior Software Engineer</p>
              <p style='color:grey;margin:2px 0px 0px 0px;font-size:14px'>Apr-2024 - Apr-2024</p>
              <p style='margin:2px 0px 10px 0px;font-size:15px'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
              </div>

              <div class="professional">
              <h3 style="margin-top:10px;color:rgb(100, 104, 127)">Professional Skills</h3>
              <table width="100%">
            <thead>
            <tr style="height:40px">
                  <th>
                      Skill
                  </th>
                  <th>
                      Rating
                  </th>
                  <th>
                      Experience
                  </th>
                  <th>
                      Status
                  </th>
            </tr>
            </thead>

            <tbody>
                  <tr style="height:40px">
                  <td style="text-align:left;padding-left:5px">HTML</td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"><span>&nbsp;Expert</span></td>
                  <td style="text-align:left;padding-left:5px">5 years</td>
                  <td style="text-align:left;padding-left:5px">Active</td>
                  </tr>

                  <tr style="height:40px">
                  <td style="text-align:left;padding-left:5px">Java</td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"><span>&nbsp;Expert</span></td>
                  <td style="text-align:left;padding-left:5px">3 years</td>
                  <td style="text-align:left;padding-left:5px">Active</td>
                  </tr>

                  <tr style="height:40px">
                  <td style="text-align:left;padding-left:5px">Angular</td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/5940f743-f679-45e1-9dba-8f1fcb6f9c47.png" title="demo-logo2.png" class="ng-star-inserted"><span>&nbsp;Learner</span></td>
                  <td style="text-align:left;padding-left:5px">0 years</td>
                  <td style="text-align:left;padding-left:5px">Active</td>
                  </tr>
            </tbody>
            </table>
              </div>

              <div class="carrer">
              <h3 style="margin-top:10px;color:rgb(100, 104, 127)">Carrer path</h3>
              <table width="100%">
              <thead>
              <tr style="height:40px">
                    <th>
                        Path
                    </th>
                    <th>
                        Carrer Level
                    </th>
                    <th>
                        Profile Level
                    </th>
              </tr>
              </thead>

              <tbody >
                    <tr style="height:40px">
                    <td style="text-align:left;padding-left:5px">Angular</td>
                    <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"><span>&nbsp;Learner</span></td>
                    <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"><span>&nbsp;Learner</span></td>
                    </tr>
              </tbody>
              </table>
              </div>

              <div class="industry">
              <h3 style="margin-top:15px;color:rgb(100, 104, 127)">Industries of exposure</h3>
              <p style="margin:3px 0px 0px 15p">Accounting/auditing</p>
              <p style="margin:2px 0px 0px 0px">Advertisement/PR</p>
              <p style="margin:2px 0px 0px 0px">Telecom/ISP</p>
              <p style="margin:2px 0px 0px 0px">Telecommunication, Internet</p>
              <p style="margin:2px 0px 0px 0px">Water Treatment, waste Management</p>
              <p style="margin:2px 0px 0px 0px">Wealth</p>
              </div>

              <div class="refer">
              <h3 style="margin-top:15px;color:rgb(100, 104, 127)">iCanReferAssessment</h3>
              <table width="100%">
            <thead>
            <tr style="height:40px">
                  <th>
                      Parameter
                  </th>
                  <th>
                      Level
                  </th>
            </tr>
            </thead>

            <tbody >
                  <tr style="height:40px">
                  <td style="text-align:left;padding-left:5px">Education Level</td>
                  <td style="padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/5940f743-f679-45e1-9dba-8f1fcb6f9c47.png" title="demo-logo2.png" class="ng-star-inserted"><span>&nbsp;Basic</span></td>
                  </tr>

                  <tr style="height:40px">
                  <td style="text-align:left;padding-left:5px">Presentation</td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"><span>&nbsp;Moderate</span></td>
                  
                  </tr>

                  <tr style="height:40px">
                  <td style="text-align:left;padding-left:5px">Ready For travel</td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/10c48d52-e65d-40b7-a731-a30755bad15d.png" title="demo-logo2.png" class="ng-star-inserted"><span>&nbsp;Good</span></td>
                 
                  </tr>

                  <tr style="height:40px">
                  <td style="text-align:left;padding-left:5px">Overall candidate level</td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/5eeca1c5-af34-4c2b-98e8-2473432e2cfa.png" title="demo-logo2.png" class="ng-star-inserted"><span>&nbsp;Very good</span></td>
                  </tr>

                  <tr style="height:40px">
                  <td style="text-align:left;padding-left:5px">Anchor/Model status</td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"><span>&nbsp;Excellent</span></td>
                  </tr>
            </tbody>
            </table>
              </div>



              <div class="lang">
              <h3 style="margin-top:10px;color:rgb(100, 104, 127)">Languages</h3>
              <table width="100%">
            <thead>
            <tr style="height:40px">
                  <th>
                      Language
                  </th>
                  <th>
                      Speak
                  </th>
                  <th>
                      Read
                  </th>
                  <th>
                      Write
                  </th>
                  <th>
                      Mother Tongue
                  </th>
            </tr>
            </thead>

            <tbody >
                  <tr style="height:50px">
                  <td style="text-align:left;padding-left:5px">English</td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px">Yes</td>
                  </tr>

                  <tr style="height:50px">
                  <td style="text-align:left;padding-left:5px">Thai</td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/5940f743-f679-45e1-9dba-8f1fcb6f9c47.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/10c48d52-e65d-40b7-a731-a30755bad15d.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px">No</td>
                  
                  </tr>

                  <tr style="height:50px">
                  <td style="text-align:left;padding-left:5px">Urdu</td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px">No</td>
                  </tr>

                  <tr style="height:50px">
                  <td style="text-align:left;padding-left:5px">Finish</td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/cc5b7133-3722-40c9-b110-63371d29d55e.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/cc5b7133-3722-40c9-b110-63371d29d55e.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px"> <img style="width: 140px; height: 20px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/cc5b7133-3722-40c9-b110-63371d29d55e.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="text-align:left;padding-left:5px">No</td>
                  </tr>
            </tbody>
            </table>
              </div>



              <div class="license">
              <h3 style="margin-top:10px;color:rgb(100, 104, 127)">Driving License</h3>
              <table width="100%">
            <thead>
            <tr style="height:40px">
                  <th>
                      Country
                  </th>
                  <th>
                      License Type
                  </th>
                  <th>
                      Number
                  </th>
                  <th>
                      Issue Date
                  </th>
                  <th>
                      Expiry Date
                  </th>
                  <th>
                  Attachment
                  </th>
            </tr>
            </thead>


            <tbody >
            <tr style="height:40px">
            <td style="text-align:left;padding-left:5px">India</td>
            <td style="text-align:left;padding-left:5px">2 Wheeler</td>
            <td style="text-align:left;padding-left:5px">Heavy</td>
            <td style="text-align:left;padding-left:5px">22-Apr-2024</td>
            <td style="text-align:left;padding-left:5px">30-Apr-2024</td>
            </tr>

            <tr style="height:40px">
            <td style="text-align:left;padding-left:5px">India</td>
            <td style="text-align:left;padding-left:5px">Heavy Wheeler</td>
            <td style="text-align:left;padding-left:5px">FRRW</td>
            <td style="text-align:left;padding-left:5px">11-May-2020</td>
            <td style="text-align:left;padding-left:5px">23-Apr-2024</td>
            </tr>
            </tbody>

            </table>
            </div>        
         </div>
      </div>
</body>

</html>
`
      )
    );
  }


  loadDocument3() {
    TXTextControl.loadDocument(
      TXTextControl.StreamType.HTMLFormat,
      btoa(
        `

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Software Developer</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 2;
            margin: 0;
            padding: 0;
        }

        .container {
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            font-size:14px;
            line-height: 1.5em;
        }
       h3,
         {
            margin-top: 1rem;
            margin-bottom: .5rem;
            font-size:15px;

        }

        h5,
        h6 {
            margin: 0px 1.2rem;
        }

        p,
        ul,
        li {
            margin: 0px;
            font-size: 13px;
        }

        img{
          width:10px;
        }
        th,td{
          text-align:left;
          padding:5px;
        }

        .thh{
          font-size: 14px;
        }
        .tdd{
          font-size:13px;
        }
       .industry-item {
          border-radius: 6px;
          padding: 10px;
          background-color: #EEEDEB;
          margin: 5px;
        }

  </style>
</head>

<body>
  <div class="container">
    <div style='text-align:center'>
      <img  id="resumeViewer" frameborder="0" style="width: 80px; height: 40px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/6068f27a-e72f-4e96-90ba-ada65ce350b1.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&amp;X-Goog-Credential=478594593338-74uha9dmfejgd8nt1d7hm01d72tbj6or%40developer.gserviceaccount.com%2F20240502%2Fauto%2Fstorage%2Fgoog4_request&amp;X-Goog-Date=20240502T115215Z&amp;X-Goog-Expires=3540&amp;X-Goog-SignedHeaders=host&amp;X-Goog-Signature=659485032904c9f5cfe1c30e8801a4d90c74c8fe0f36153ef000bb644b875da2409610ad90a3ea36641481c344d307e12768daf779ca10d17de473ff8d9b2f613e98e44f162643229a918769df5e53d9d259a57c5cf4d28b44174b8f068dd710ca29a7bda2279c9afdd34b2c2880984ae3bd54aff0fb672c5fb2df0989c71f01e8e8c4026c2abc4ef510dc10e54d9c0fb0503c7da9a049dad395c01e10ad1d99e717acd15fe363c31d0a0197c3a0847c178cc1b9660b68f79b98187d44597f8f5d038a1697246588e69eb33114b1c700029c322498e0b86ded527895279709a24566086d8862032076fbf15f0ef4904fe89c2e21900dbed841dcb048f7eeb24c" title="demo-logo2.png" class="ng-star-inserted">
      <h2>Harishwar Reddy</h2>
    </div>
    <div class="section" style="line-height: 1.6em;">
    <table style="border:2px solid white;">
    <tr>
    <th style="border:2px solid white;" class="thh">Mobile Number</th>
    <th style="border:2px solid white;" class="thh">WA Mobile Number</th>
    </tr>
    <tr>
    <td style="border:2px solid white;" class="tdd">+91 9701632398</td>
    <td style="border:2px solid white;" class="tdd">+91 9701632398</td>
    </tr>
    <tr>
    <th style="border:2px solid white;" class="thh">Email Id</th>
    <th style="border:2px solid white;" class="thh">Date of Birth</th>
    </tr>
    <tr>
    <td style="border:2px solid white;" class="tdd">harishreddymallu1@gmail.com</td>
    <td style="border:2px solid white;" class="tdd">13-Mar-1992</td>
    </tr>
    <tr>
    <th style="border:2px solid white;" class="thh">Preferred Location</th>
    <th style="border:2px solid white;" class="thh">Preferred Location</th>
    </tr>
    <tr>
    <td style="border:2px solid white;" class="tdd">Dubai, United Arab Emirates, United States of America, Iran</td>
    <td style="border:2px solid white;" class="tdd">Dubai, UAE</td>
    </tr>
    <tr>
    <th style="border:2px solid white;" class="thh">Experience</th>
    <th style="border:2px solid white;" class="thh">Current CTC</th>
    </tr>
    <tr>
    <td style="border:2px solid white;" class="tdd">6 Years</td>
    <td style="border:2px solid white;" class="tdd">INR 50000 perAnnum</td>
    </tr>
    <tr>
    <th style="border:2px solid white;" class="thh">Expected CTC</th>
    <th style="border:2px solid white;" class="thh">Nationality</th>
    </tr>
    <tr>
    <td style="border:2px solid white;" class="tdd">INR 600000 perAnnum</td>
    <td style="border:2px solid white;" class="tdd">Indian</td>
    </tr>
    <tr>
    <th style="border:2px solid white;" class="thh">Passport Number</th>
    <th style="border:2px solid white;" class="thh">Passport Issue Date</th>
    </tr>
    <tr>
    <td style="border:2px solid white;" class="tdd">8987765556655666</td>
    <td style="border:2px solid white;" class="tdd">13-Mar-1992</td>
    </tr>
    <tr>
    <th style="border:2px solid white;" class="thh">Passport Expiry Date</th>
    <th style="border:2px solid white;" class="thh">ECR/ECNR</th>
    </tr>
    <tr>
    <td style="border:2px solid white;" class="tdd">23-Mar-2000</td>
    <td style="border:2px solid white;" class="tdd">ECNR</td>
    </tr>
    <tr>
    <th style="border:2px solid white;" class="thh">Preffered Job Types</th>
    <th style="border:2px solid white;" class="thh"></th>
    </tr>
    <tr>
    <td style="border:2px solid white;" class="tdd">Full Time - Regular, Full Time Contract, Campus Placement</td>
    <td style="border:2px solid white;" class="tdd"></td>
    </tr>
    </table>
    </div>
   <div class="section" >
        <h3 style="margin-top:15px;">Career Objective</h3>
        <p>Full Stack Developer with 3+ years experience in web & mobile app development. Skilled in front-end
             &back-end . Passionate about creatin user-friendly.</p>
    </div>
    <div class="section" >
      <h3 style="margin-top:20px;">Education</h3>
      <h4 style="margin-top:-2px;font-size:13px">Ph.D in High Energy Phisics - .Net Certificates(76%)</h4>
      <p style="margin-top:-2px;">Govt Eng College Gandhinagar(RTU)</p>
      <p style="color:gray;margin-top:-2px;">Apr-2022 - Apr-2024</p>
    </div>
    <div class="section">
      <h3 style="margin-top:15px;">Training and Certification</h3>
      <p>8th Rank in University during 6th semester</p>
      <p>Six Sigma Green Belt from Motorola, USA during 2009</p>
    </div>
    <div class="section" style="margin-top: .5rem;">
        <h3 style="margin-top:20px;">Work Experience</h3>
        <p style="font-weight:bold;font-size:14px;margin-top:-3px;">Senior Software Engineer</p>
        <p style="color:gray;margin-top:-2px;">Sep 2022 - Present (1 year 8 months)</h6>
        <p style="margin-top:-2px;">
                Front End Developer at Banke International in Dubai
                *BankeNow web & mobile app for property listings, leasing, buying & selling
                *ERP web app with HRMS, recruitment & CRM functionalities
                *Improved design for existing systems with better UI/UX
                *Collaborated with team, translated designs to code & integrated front-end with back-end
                *Delivered high-quality results meeting client requirements & exceeding user expectations
        </p>
        <div>
        <p style="font-weight:bold;font-size:14px;">Service Delivery Engineer</p>
        <p style="color:gray;margin-top:-2px;">Sep 2022 - Present (1 year 8 months)</p>
        <p>
                Front End Developer at Banke International in Dubai
                *BankeNow web & mobile app for property listings, leasing, buying & selling
                *ERP web app with HRMS, recruitment & CRM functionalities
                *Improved design for existing systems with better UI/UX
                *Collaborated with team, translated designs to code & integrated front-end with back-end
                *Delivered high-quality results meeting client requirements & exceeding user expectations
        </p>
        </div>
      </div>
      <div class="section" style="margin-top:.5rem">
            <h3 style="margin-top:20px;">Professional Skills</h3>
            <table width="100%" style="border-collapse: collapse;" >
            <thead>
            <tr style="background-color:#EEEDEB;">
                  <th>
                      Skill
                  </th>
                  <th>
                      Rating
                  </th>
                  <th>
                      Experience
                  </th>
                  <th>
                      Status
                  </th>
            </tr>
            </thead>

            <tbody>
                  <tr>
                  <td style="border:0px">HTML</td>
                  <td style="border:0px"> <img  id="resumeViewer" frameborder="0" style="width: 95px; color: green; height: 15px;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="border:0px">5 Years</td>
                  <td style="border:0px">Active</td>
                  </tr>
                  <tr>
                  <td style="border:0px">Java</td>
                  <td style="border:0px"> <img  id="resumeViewer" frameborder="0" style="width: 95px; color: green; height: 15px;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="border:0px">3 Years</td>
                  <td style="border:0px">Active</td>
                  </tr>
                  <tr>
                  <td>Angular</td>
                  <td style="border:0px"> <img  id="resumeViewer"  frameborder="0" style="width: 95px; color: green; height: 15px;" src="https://storage.googleapis.com/ezeone/icanrefer/5940f743-f679-45e1-9dba-8f1fcb6f9c47.png" title="demo-logo2.png" class="ng-star-inserted"></td>
                  <td style="border:0px">0 Years</td>
                  <td style="border:0px">Active</td>
                  </tr>
            </tbody>
            </table>
        </div>

        <div class="section">
        <h3 style="margin-top:10px;">Career Path</h3>
        <table width="100%" class="tab">
        <thead>
        <tr style="background-color:#EEEDEB;">
              <th>
                  Path
              </th>
              <th>
                 Career Level
              </th>
              <th>
                  Profile Level
              </th>
        </tr>
        </thead>

        <tbody>
              <tr>
              <td>Customer Support(Customer Service)</td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>

              </tr>
              <tr>
              <td>Customer Support(Customer Service)</td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/10c48d52-e65d-40b7-a731-a30755bad15d.png" title="demo-logo2.png" class="ng-star-inserted"></td>

              </tr>

        </tbody>
        </table>
    </div>

    <div class="section">
    <h3>Industry of Exposure</h3>
    <div style="font-weight:bold;line-height:1.9em">
    <span class="industry-item">Accounting/Auditing</span>&nbsp;&nbsp;
    <span class="industry-item">Advertisement</span>&nbsp;&nbsp;
    <span class="industry-item">Telecom</span>&nbsp;&nbsp;
    <span class="industry-item">Telecommunication/Internet</span>&nbsp;&nbsp;
    <span class="industry-item">Water Treatment/Waste Management</span>&nbsp;&nbsp;
    <span class="industry-item">Wealth</span>
    </div>
</div>


<div class="section">
<h3 style="margin-top:20px;">ICanRefer Assessment</h3>
<table width="100%" class="tab">
<thead>
<tr style="background-color:#EEEDEB;">
      <th>
          Parameter
      </th>
      <th>
         Level
      </th>
</tr>
</thead>

<tbody>
      <tr>
      <td>Education level</td>
      <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/5940f743-f679-45e1-9dba-8f1fcb6f9c47.png" title="demo-logo2.png" class="ng-star-inserted"></td>

      </tr>
      <tr>
      <td>Presentation</td>
      <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>

      </tr>
      <tr>
      <td>Ready for Travel</td>
      <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/10c48d52-e65d-40b7-a731-a30755bad15d.png" title="demo-logo2.png" class="ng-star-inserted"></td>
      </tr>
      <tr>
      <td>Overall candidate level</td>
      <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/5eeca1c5-af34-4c2b-98e8-2473432e2cfa.png" title="demo-logo2.png" class="ng-star-inserted"></td>
      </tr>
      <tr>
      <td>Anchor/Model Status</td>
      <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"></td>
      </tr>
</tbody>
</table>
</div>

        <div class="section" style="margin-top:30%">
        <h3 style="margin-top:10px;">Languages</h3>
        <table width="100%" class="tab">
        <thead>
        <tr style="background-color:#EEEDEB;">
              <th>
                 Language
              </th>
              <th>
                 Speak
              </th>
              <th>
                  Read
              </th>
              <th>
                  Write
              </th>
              <th>
                  Mother Tongue
              </th>
        </tr>
        </thead>

        <tbody>
              <tr>
              <td>English</td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/cc5b7133-3722-40c9-b110-63371d29d55e.png" title="demo-logo2.png" class="ng-star-inserted"></td>

              </tr>
              <tr>
              <td>Telugu</td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/cc5b7133-3722-40c9-b110-63371d29d55e.png" title="demo-logo2.png" class="ng-star-inserted"></td>

              </tr>
              <tr>
              <td>Urdu</td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>


              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/1d4ca3a7-ba8a-46db-b1aa-8a745c282e5b.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/cc5b7133-3722-40c9-b110-63371d29d55e.png" title="demo-logo2.png" class="ng-star-inserted"></td>

              </tr>
              <tr>
              <td>Thai</td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/c1b7a09f-6da3-4217-b1a3-d9fca0450fdb.png" title="demo-logo2.png" class="ng-star-inserted"></td>
              <td> <img  id="resumeViewer" frameborder="0" style="color: green; height: 15px;width: 95px; object-fit: contain;" src="https://storage.googleapis.com/ezeone/icanrefer/cc5b7133-3722-40c9-b110-63371d29d55e.png" title="demo-logo2.png" class="ng-star-inserted"></td>

              </tr>

        </tbody>
        </table>
    </div>

    <div class="section">
        <h3>Driving  License</h3>
        <table width="100%" class="tab">
        <thead>
        <tr style="background-color:#EEEDEB;">
              <th>
                  Country
              </th>
              <th>
                 Licence Type
              </th>
              <th>
                  Number
              </th>
              <th>
                  Issue Date
              </th>
              <th>
                  Expiry Date
              </th>
              <th>
                  Number
              </th>
        </tr>
        </thead>

        <tbody>
              <tr>
              <td>India</td>
              <td>2 Wheeler</td>
              <td>Heavy</td>
              <td>22-Apr-2024</td>
              <td>30-Apr-2024</td>
              <td></td>

              </tr>
              <tr>
              <td>India</td>
              <td>Heavy Vehicle</td>
              <td>FRRW</td>
              <td>11-May-2020</td>
              <td>23-Apr-2024</td>
              <td></td>
              </tr>

        </tbody>
        </table>
    </div>



    </div>
</body>

</html>
        `
      )
    );
  }
}
