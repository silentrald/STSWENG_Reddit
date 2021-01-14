*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot

*** Variables ***

*** Test Cases ***
1.1 Successful registration
    [documentation]  User Registration

    Open Chrome
    Click Element  id:signup
    Wait Until Page Contains Element  id:username
    Input Text  id:username  JohnCena1
    Input Text  id:email  Johncena@gmail.com
    Input Text  id:password  Password1
    Input Text  id:cpassword  Password1
    Click Element  id:submit
    Page Should Contain Element  xpath://*[@id="__layout"]/div/div/div
    Close Browser

1.2 Username too short, Invalid email, Password too weak
    [documentation]  User Registration

    Open Chrome
    Click Element  id:signup
    Wait Until Page Contains Element  id:username
    Input Text  id:username  dude
    Input Text  id:email  dude
    Input Text  id:password  Password
    Input Text  id:cpassword  Password
    Click Element  id:submit
    Element Text Should be  xpath://html/body/div/div/div/div/div/form/div[1]/div  Username is too short (min 8)
    Element Text Should be  xpath://html/body/div/div/div/div/div/form/div[2]/div  Email is invalid
    Element Text Should be  xpath://html/body/div/div/div/div/div/form/div[3]/div  Password is too weak
    Close Browser

1.3 Username already taken
    [documentation]  User Registration

    Open Chrome
    Click Element  id:signup
    Wait Until Page Contains Element  id:username
    Input Text  id:username  username
    Input Text  id:email  username@gmail.com
    Input Text  id:password  Password1
    Input Text  id:cpassword  Password1
    Click Element  id:submit
    Wait Until Page Contains Element  class:error
    Element Text Should be  class:error  Username is already used
    Close Browser

1.4 Password do not match
    [documentation]  User Registration

    Open Chrome
    Click Element  id:signup
    Wait Until Page Contains Element  id:username
    Input Text  id:username  username
    Input Text  id:email  username@gmail.com
    Input Text  id:password  Password1
    Input Text  id:cpassword  Password
    Click Element  id:submit
    Element Text Should be  class:error  Passwords are not the same
    Close Browser

*** Keywords ***
