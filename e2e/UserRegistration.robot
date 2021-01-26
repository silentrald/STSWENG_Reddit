*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup  Open Chrome

*** Variables ***

*** Test Cases ***
1.1 Successful registration
    [documentation]  User Registration
    
    Click Element  id:signup
    Wait Until Page Contains Element  id:username
    Input Text  id:username  JohnCena1
    Input Text  id:email  Johncena@gmail.com
    Input Text  id:password  Password1
    Input Text  id:cpassword  Password1
    Click Element  id:submit
    Page Should Contain Element  xpath://*[@id="__layout"]/div/div/div

1.21 Password too weak - No uppercase and number
    [documentation]  User Registration

    Reload Page
    Click Element  id:signup
    Wait Until Page Contains Element  id:username
    Input Text  id:username  username6969
    Input Text  id:email  username6969
    Input Text  id:password  password
    Input Text  id:cpassword  password
    Click Element  id:submit
    Element Text Should be  xpath://html/body/div/div/div/div/div/form/div[3]/div  Password must contain atleast 1 uppercase, lowercase and number characters.

1.22 Password too weak - No number
    [documentation]  User Registration

    Input Text  id:password  Password
    Input Text  id:cpassword  Password
    Click Element  id:submit
    Element Text Should be  xpath://html/body/div/div/div/div/div/form/div[3]/div  Password must contain atleast 1 uppercase, lowercase and number characters.

1.23 Password too weak - No uppercase
    [documentation]  User Registration

    Input Text  id:password  password1
    Input Text  id:cpassword  password1
    Click Element  id:submit
    Element Text Should be  xpath://html/body/div/div/div/div/div/form/div[3]/div  Password must contain atleast 1 uppercase, lowercase and number characters.

1.24 Password too weak - Has uppercase and number, but <8 characters
    [documentation]  User Registration

    Input Text  id:password  Pas1
    Input Text  id:cpassword  Pas1
    Click Element  id:submit
    Element Text Should be  xpath://html/body/div/div/div/div/div/form/div[3]/div  Password is too short (min 8)

1.3 Username too short
    [documentation]  User Registration

    Reload Page
    Click Element  id:signup
    Wait Until Page Contains Element  id:username
    Input Text  id:username  usernam
    Input Text  id:email  usernam
    Input Text  id:password  Password1
    Input Text  id:cpassword  Password1
    Click Element  id:submit
    Element Text Should be  xpath://html/body/div/div/div/div/div/form/div[1]/div  Username is too short (min 8)

#to be changed
1.41 Invalid email - [string]
    [documentation]  User Registration

    Reload Page
    Click Element  id:signup
    Wait Until Page Contains Element  id:username
    Input Text  id:username  username12345
    Input Text  id:email  dude
    Input Text  id:password  Password1
    Input Text  id:cpassword  Password1
    Click Element  id:submit
    Element Text Should be  xpath://html/body/div/div/div/div/div/form/div[2]/div  Email is invalid

1.42 Invalid email - [string]@[string]
    [documentation]  User Registration

    Input Text  id:email  dude@dude
    Click Element  id:submit
    Element Text Should be  xpath://html/body/div/div/div/div/div/form/div[2]/div  Email is invalid

1.43 Invalid email - [string]@[string].
    [documentation]  User Registration

    Input Text  id:email  dude@dude.
    Click Element  id:submit
    Element Text Should be  xpath://html/body/div/div/div/div/div/form/div[2]/div  Email is invalid

1.5 Username already taken
    [documentation]  User Registration

    Reload Page
    Click Element  id:signup
    Wait Until Page Contains Element  id:username
    Input Text  id:username  username
    Input Text  id:email  username@gmail.com
    Input Text  id:password  Password1
    Input Text  id:cpassword  Password1
    Click Element  id:submit
    Wait Until Page Contains Element  class:error
    Element Text Should be  class:error  Username is already used

1.6 Password do not match
    [documentation]  User Registration

    Reload Page
    Click Element  id:signup
    Wait Until Page Contains Element  id:username
    Input Text  id:username  username
    Input Text  id:email  username@gmail.com
    Input Text  id:password  Password1
    Input Text  id:cpassword  Password
    Click Element  id:submit
    Element Text Should be  class:error  Passwords are not the same
    Reload Page

*** Keywords ***
