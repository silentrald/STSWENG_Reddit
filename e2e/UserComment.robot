*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup     Open Chrome and Login  username=username   password=password
*** Variables ***
${station}  SampleStation
*** Test Cases ***
10.1 Create Comment - Non-member
    [documentation]  Test if error messages appear when a non-member adds a comment to a post in a station

    Open Post
    Page Should Contain     You must be part of the station to comment.
    
10.22 Create Empty Comment - Member
    [documentation]  Test if error messages appear when a member makes an empty comment

    Join Station and Open Post  ${station} 
    Element Should Be Disabled   id:post
    Leave Station  ${station}
    #Page Should Contain     Post title is required

10.23 Create Comment - Member
    [documentation]  Test if a member can succesfully add a comment

    Join Station and Open Post  ${station} 
    Wait Until Page Contains Element  id:comment-text
    Input Text  id:comment-text  Comment Test Automation
    Click Element  id:post
    Reload Page
    Wait Until Page Contains  Comment Test Automation

11.1 Create Subcomment - Member
    [documentation]  Test if a member can successfully add a subcomment

    Click Element  xpath://html/body/div/div/div/div/div[2]/div/div[2]/div[1]/div[2]/div[3]/div[1]
    Input Text  class:subcomment-input  Subcomment Test Automation
    Click Element   class:send
    Reload Page
    Wait Until Page Contains  Subcomment Test Automation
    #Page Should Contain Element  xpath://div>div[@class='']
    #Element Should Contain  
    #//span[@class='select-all' and text()='Uncheck All']
    #Page Should Contain     Post title is required

12.1 Edit Comment
    [documentation]  Test if the author of a comment can edit their comment

    Click Element  xpath://html/body/div/div/div/div/div[2]/div/div[2]/div[1]/div[2]/div[3]/div[2]
    Input Text  class:w-100  Edited Comment
    Click Element  class:float-right
    Reload Page
    Wait Until Page Contains  Edited Comment
    Page Should Not Contain  Comment Test Automation

12.2 Edit Subcomment
    [documentation]  Test if the author of a subcomment can edit their subcomment

    Click Element  xpath://html/body/div/div/div/div/div[2]/div/div[2]/div[2]/div/div/div[2]/div[3]/div[2]
    Input Text  class:w-100  Edited Subcomment
    Click Element  class:float-right
    Reload Page
    Wait Until Page Contains  Edited Subcomment
    Page Should Not Contain  Subcomment Test Automation

13.1 Delete Comment
    [documentation]  Test if the author of a comment can delete their comment

    Click Element  xpath://html/body/div/div/div/div/div[2]/div/div[2]/div[1]/div[2]/div[3]/div[3]
    Reload Page
    Wait Until Page Contains  [deleted]
    Page Should Not Contain  Edited Comment

13.2 Delete Subcomment
    [documentation]  Test if the author of a subcomment can delete their subcomment

    Click Element  xpath://html/body/div/div/div/div/div[2]/div/div[2]/div[2]/div/div/div[2]/div[3]/div[3]
    Reload Page
    Wait Until Page Contains  [deleted]
    Page Should Not Contain  Edited Subcomment
    Leave Station  ${station}
    
*** Keywords ***
