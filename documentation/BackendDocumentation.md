# Index

- [1. Agent routes](#1-agentcontrollerts)
  - [1.1 Get agent profile](#11-get-agent-profile)
  - [1.2 Get agent's feedback](#12-get-agents-feedback)
  - [1.3 Accept agent's feedback](#13-accept-agents-feedback)
  - [1.4 Update agent's profile picture](#14-update-agents-profile-picture)
  - [1.5 Update agent's status](#15-update-agents-status)

---

- [2. Authentication routes](#2-authenticationcontrollerts)
  - [2.1 Sign up an agent](#21-sign-up-an-agent)
  - [2.2 Sign up a manager](#22-sign-up-a-manager)
  - [2.3 Verify an account](#23-verify-an-account)
  - [2.4 Sign in the application](#24-sign-in-the-application)
  - [2.5 Sign out the application](#25-sign-out-the-application)
  - [2.6 Initialize a forgot password flow](#26-initialize-a-forgot-password-flow)
  - [2.7 Confirm a new password](#27-confirm-a-new-password)
  - [2.8 Get active user's email](#29-get-active-users-email)
  - [2.9 Get all the user's signed in the application](#210-get-all-the-users-signed-in-the-application)

---

- [3. Client routes](#3-clientcontrollerts)
  - [3.1 Register a client](#31-register-a-client)

---

- [4. Key-Click Recording routes](#4-keyclickcontrollerts)
  - [4.1 Add a keystroke done by an agent](#41-add-a-keystroke-done-by-an-agent)
  - [4.2 Add a click done by an agent](#42-add-a-click-done-by-an-agent)
  - [4.3 Delete all the files created by the controller](#43-delete-all-the-files-created-by-the-controller)

---

- [5. Manager routes](#5-managercontrollerts)
  - [5.1 List all agents in the system and its attributes](#51-list-all-agents-in-the-system-and-its-attributes)
  - [5.2 Get agent profile](#52-get-agent-profile)
  - [5.3 Get manager profile](#53-get-manager-profile)
  - [5.4 Show a specific recording](#54-show-a-specific-recording)
  - [5.5 Show recordings of an agent](#55-show-recordings-of-an-agent)
  - [5.6 Show recordings filtered by tags](#56-show-recordings-filtered-by-tags)
  - [5.7 Show newest recordings](#57-show-newest-recordings)
  - [5.8 Show newest or oldest recordings](#58-show-newest-or-oldest-recordings)
  - [5.9 Post comments to an agent](#59-post-comments-to-an-agent)
  - [5.10 Update manager's profile picture](#510-update-managers-profile-picture)

---

- [6. Third-Party-Services routes](#6-thirdpartyservicescontrollerts)
  - [6.1 Ask for a Thirs Party Service](#61-ask-for-a-thirs-party-service)
  - [6.2 Send Third Party Service via e-mail](#62-send-third-party-service-via-e-mail)

---

- [7. User Configuration routes](#7-userconfigurationsts)
  - [7.1 Get user's configuration](#71-get-users-configuration)
  - [7.2 Update user's configuration](#72-update-users-configuration)

# 1. AgentController.ts

## 1.1 Get agent profile

This route lets you get all the data of a specific agent.

- **Endpoint**: `/agent/agentProfile`
- **Method**: `GET`
- **Body**: Doesn't receive a body because of `GET` method but receives a query parameter like this: `https://backend.bannkonect.link/agent/agentProfile?email=agent@bankonnect.link`

- **Validations**: _No body validation needed_.
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                 |Message                                          | Http | 
  |----------------------|-------------------------------------------------|------|
  | NoTokenFound         | The token is not present in the request         | 500  |
  | InvalidTokenException| The token is not valid                           | 500  |
  | _No code_            | No agent with email: agent@bankonnect.link found| 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "agent_id": "asdasdlo-1323-asdg-3fsl-3df401o23l4s",
    "super_id": "kjk3m3kl-3l3s-3423-42fd-32fdsfwllp32",
    "name":  "Bruce Banner",
    "password": "okasdpojjdpaojpsojpaokpoaipoi",
    "email": "awesome_hulk@bankonnect.link",
    "profile_picture": "https://profile.com/hulk.png",
    "rating": 4.8,
    "status": "Active",
    "calls": 90
  }
  ```
- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 1.2 Get agent's feedback

This route lets you get all the feedback an agent has received.

- **Endpoint**: `/agent/getFeedback`
- **Method**: `GET`
- **Body**: Doesn't receive a body because of `GET` method but receives a query parameter like this: `https://backend.bankonnect.link/agent/getFeedback?email=agent@bankonnect.link`

- **Validations**: _No body validation needed_.

  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                  | Message                                                   | Http |
  | --------------------- | --------------------------------------------------------- | ---- |
  | NoTokenFound          | The token is not present in the request                   | 500  |
  | InvalidTokenException | The token is not valid                                     | 500  |
  | _No code_               | Cannot read properties of undefined (reading 'agent_id')  | 500  |

- **Response**: `HTTP status 200`

  ```json
  {
    "agent_name": "Stephen Strange",
    "agent_email": "dr.strange@gmail.com",
    "comments": [
      {
        "comment_id": 203492,
        "super_id": "0asodsaj-dhda-213e-3123-asedsskelopl",
        "comment": "You can improve.",
        "rating": 3,
        "date": "2022-06-06 15:13:56"
      },
      {
        "comment_id": 203493,
        "super_id": "089alksa-2das-d22s-3dqw-eopaaa331ds4",
        "comment": "You are great!",
        "rating": 5,
        "date": "2022-06-07 20:01:17"
      }
    ]
  }
  ```

- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 1.3 Accept agent's feedback

This route lets an agent to mark as read the feedback provided by a quality agent.

- **Endpoint**: `/agent/acceptFeedback`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "comment_id": "1929"
  }
  ```
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | comment_id               | Comment ID must be a string        |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                    | Message                                        | Http |
  | ----------------------- | ---------------------------------------------- | ---- |
  | NoTokenFound            | The token is not present in the request        | 500  |
  | InvalidTokenException   | The token is not valid                          | 500  |
  | _No code_                 | Comment ID must be a string                    | 422  |
  

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Comment 123 has been updated"
  }
  ```
- **If an error occurs**: `HTTP status 500` or `HTTP status 422`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 1.4 Update agent's profile picture

This route is used to change the agent's profile picture when needed.

- **Endpoint**: `/agent/updateProfilePicture`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "user_email": "agent@bamkonnect.link",
    "profile_picture": "http://pp.link/new_pic.png"
  }
  ```
- **Validations**:
  | Field           | Validation            |
  | --------------- | --------------------- |
  | user_email      | Must be a valid email |
  | profile_picture | Must be a string      |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                     | Message                                        | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | NoTokenFound             | The token is not present in the request        | 500  |
  | InvalidTokenException    | The token is not valid                          | 500  |
  | _No code_                 | Must be a valid email                          | 422  |
  | _No code_                  | profile_picture must be a string               | 422  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Profile picture updated"
  }
  ```
- **If an error occurs**: `HTTP status 500` or `HTTP status 422`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 1.5 Update agent's status

This route is used to change the status of an agent when a call is active or when the agent is online, offline or in-call.

- **Endpoint**: `/agent/updateAgentStatus`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "agent_id": "8sahdkqw-2lda-139l-232l-o80sdffkmslf",
    "status": "agent's status" //Could be Active, Inactive or In-Call
  }
  ```
- **Validations**: _No body validation needed_.
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                     | Message                                        | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | NoTokenFound             | The token is not present in the request        | 500  |
  | InvalidTokenException    | The token is no valid                          | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Agent status updated"
  }
  ```
- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

# 2. AuthenticationController.ts

## 2.1 Sign up an agent

Route that lets an agent to sign up in our application.

- **Endpoint**: `/auth/signupAgent`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "super_email": "super@bankonnect.link",
    "name": "Clark Kent",
    "password": "My_P4ssw0rD!",
    "email": "agent@bankonnect.link",
    "phone_number": "+525516768922",
    "profile_picture": "https://bankonnect.link/pic.png"
  }
  ```
- **Validations**:
  | Field           | Validation                               |
  | --------------- | ---------------------------------------- |
  | email           | Must be a valid email address            |
  | password        | Must be a string                         |
  | password        | Must be at least 8 characters long       |
  | name            | Must be a string                         |
  | name            | Must be between 2 and 40 characters long |
  | super_email     | Must be a valid email                    |
  | profile_picture | Must be a string                         |
  | Access token             | Not required                       |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                      | Message                                                                                                                                                | Http |
  | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
  | InvalidRequestException   | A user with username [Name] already exists in your directory                                                                                        | 500  |
  | UsernameExistsException   | An account with the given email already exists.                                                                                                        | 500  |
  | InvalidParameterException | Invalid password. Password should be between 8 to 64 characters, and must contain at least one uppercase letter, one lowercase letter, and one number. | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Agent signed up",
    "body": {
      "super_id": "1jlk432l-4k2m-1lk2-12j4-13124jl124l1",
      "name": "Clark Kent",
      "password": "p28m9oc0wnyr9ciomwqemc3r9ifou",
      "email": "agent@bankonnect.link",
      "phone_number": "+526789096711"
    }
  }
  ```
- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 2.2 Sign up a manager

Route that lets a manager to sign up in our application.

- **Endpoint**: `/auth/signupManager`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "The Ancient One",
    "password":"My_P4ssw0rD!",
    "email": "manager_or_quality@bankonnect.link",
    "role": true, // True for quality agents and false for admin only
    "phone_number": "+526781927877",
    "profile_picture": "https://bankonnect.link/pic.png"
  }
  ```
- **Validations**:
  | Field           | Validation                               |
  | --------------- | ---------------------------------------- |
  | email           | Must be a valid email address            |
  | password        | Must be a string                         |
  | password        | Must be at least 8 characters long       |
  | name            | Must be a string                         |
  | name            | Must be between 2 and 40 characters long |
  | role            | Must be boolean                          |
  | profile_picture | Must be a string                         |
  | Access token             | Not required                       |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                      | Message                                                                                                                                                                 | Http |
  | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
  | InvalidParameterException | User name can only contain the following characters: a-z, A-Z, 0-9, _ (underscore), - (hyphen), + (plus), . (period) and should follow email's format when using @ (at) | 500  |
  | InvalidParameterException | Invalid phone number format.                                                                                                                                            | 500  |
  | InvalidRequestException   | A user with username [Name] already exists in your directory                                                                                                     | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Admin signed up",
    "body": {
      "super_id": "1jlk432l-4k2m-1lk2-12j4-13124jl124lo",
      "name": "The Ancient One",
      "password": "p28m9oc0wnyr9ciomwqemc3r9ifou",
      "email": "manager_or_quality@bankonnect.link",
      "phone_number": "+526789096711"
    }
  }
  ```
- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 2.3 Verify an account

Route that verifies and agent or manager account in order to user our application.

- **Endpoint**: `/auth/verify`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "agent@bankonnect.link",
    "code": "231955"
  }
  ```
- **Validations**:
  | Field           | Validation                               |
  | --------------- | ---------------------------------------- |
  | email           | Must be a valid email address            |
  | code            | Must be a string                         |
  | Access token             | Not required                       |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                  | Message                                               | Http |
  | --------------------- | ----------------------------------------------------- | ---- |
  | CodeMismatchException | Invalid verification code provided, please try again. | 500  |
  | UserNotFoundException | Username/client id combination not found.             | 500  |
  | _No code_                  | Must be between 6 and 8 characters                    | 422  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "User agent@bankonnect.link verified"
  }
  ```
- **If an error occurs**: `HTTP status 500` or `HTTP status 422`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 2.4 Sign in the application

Route that lets a user (agent, manager or quality analyst) to sign in our app.

- **Endpoint**: `/auth/signin`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "manager_quality_or_agent@bankonnect.link",
    "password":"My_P4ssw0rD!"
  }
  ```
- **Validations**:
  | Field           | Validation                               |
  | --------------- | ---------------------------------------- |
  | email           | Must be a valid email address            |
  | password        | Must be a string                         |
  | password        | Must be at least 8 characters long       |
  | Access token             | Not required                       |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                   | Message                         | Http |
  | ---------------------- | ------------------------------- | ---- |
  | NotAuthorizedException | Incorrect username or password. | 500  |
  | UserNotFoundException  | User does not exist.            | 500  |
  
- **Response**: `HTTP status 200`
  ```json
  {
    "AccessToken": "NUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGP SOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOI",
    "ExpiresIn": 86400,
    "TokenType": "Bearer",
    "RefreshToken": "YTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8F",
    "IdToken": "YTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8F",
    "role": "Role" //Can be Agent, Admin o Quality
  }
  ```
- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 2.5 Sign out the application

Route that lets an agent to sign out from our app.

- **Endpoint**: `/auth/signout`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "manager_quality_or_agent@bankonnect.link"
  }
  ```
- **Validations**:
  | Field | Validation            |
  | ----- | --------------------- |
  | email | Must be a valid email |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                     | Message                                      | Http |
  | ------------------------ | -------------------------------------------- | ---- |
  | InvalidTokenException    | The token is not valid.                      | 500  |
  | MissingRequiredParameter | Missing required key 'AccessToken' in params | 500  |
  | NoTokenFound             | The token is not present in the request        | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "User manager_quality_or_agent@bankonnect.link signed out"
  }
  ```
- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 2.6 Initialize a forgot password flow

Route that sends an email to a user (agent, manager or quality analyst) if they forgot their password to reset it.

- **Endpoint**: `/auth/forgotPassword`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "manager_quality_or_agent@bankonnect.link"
  }
  ```
- **Validations**:
  | Field | Validation            |
  | ----- | --------------------- |
  | email | Must be a valid email |
  | Access token             | Not required                       |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                  | Message                                   | Http |
  | --------------------- | ----------------------------------------- | ---- |
  | UserNotFoundException | Username/client id combination not found. | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Password resetting email sent to manager_quality_or_agent@bankonnect.link"
  }
  ```
- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 2.7 Confirm a new password

Route that lets a user (agent, manager or quality analyst) to change and confirm their password using the code sent by email.

- **Endpoint**: `/auth/confirmPassword`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "manager_quality_or_agent@bankonnect.link",
    "confirmation_code":"123456",
    "password":"MyP4ssw0Rd!"
  }
  ```
- **Validations**:
  | Field             | Validation                    |
  | ----------------- | ----------------------------- |
  | email             | Must be a valid email         |
  | confirmation_code | Must be a string              |
  | password          | Must be a string              |
  | password          | Must be at least 8 characters |
  | Access token             | Not required                       |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                  | Message                                               | Http |
  | --------------------- | ----------------------------------------------------- | ---- |
  | CodeMismatchException | Invalid verification code provided, please try again. | 500  |
  | UserNotFoundException | Username/client id combination not found.             | 500  |
  | _No code_               | Must be at least 8 characters                         | 422  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Manager manager@bankonnect.link password changed, Cognito and Connect passwords aren't linked, to change your Connect password follow this tutorial: https://docs.aws.amazon.com/connect/latest/adminguide/password-reset.html#password-reset-aws"
  }
  ```
- **If user not found**: `HTTP status 404`
  ```json
  {
    "code": "UserNotFound",
    "message": "User not found in the database"
  }
  ```
- **If an error occurs**: `HTTP status 500` or `HTTP status 422`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 2.8 Get active user's email

Route that returns the active user's email address.

- **Endpoint**: `/auth/getUserEmail`
- **Method**: `GET`
- **Body**: Doesn't receive a body because of `GET` method.
- **Validations**: _No body validations needed_.
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                   | Message                                 | Http |
  | ---------------------- | --------------------------------------- | ---- |
  | NotAuthorizedException | Access Token has been revoked           | 500  |
  | NoTokenFound           | The token is not present in the request | 500  |
  | InvalidTokenException  | The token is not valid                   | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "user_email": "user_email@bankonnect.link"
  }
  ```
- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 2.9 Get all the user's signed in the application

Route that retrieves all the users signed on our app.

- **Endpoint**: `/auth/readUsers`
- **Method**: `GET`
- **Body**: Doesn't receive a body because of `GET` method.
- **Validations**: _No body validations needed_.
  | Field                    | Validation                        |
  | ------------------------ | --------------------------------- |
  | Access token             | Required                          |
  | Administrator privileges | Administrator privileges required |

- **Errors**:
  | Code                   | Message                                 | Http |
  | ---------------------- | --------------------------------------- | ---- |
  | InvalidTokenException  | The token is not valid.                 | 500  |
  | NotAuthorizedException | Access Token has been revoked           | 500  |
  | NoTokenFound           | The token is not present in the request | 500  |


- **Response**: `HTTP status 200`
  ```json
  {
    "agents": [
      {
        "agent_id": "k123k1j23-7410-4c71-8975-hj12jk3jl12k",
        "super_id": "213knl12312ml-844f-416c-8159-n123klj1l241",
        "name": "Miles Morales",
        "password": "cdc604359845df597522b5caad1af29487fb98ea9faaad3b64c41a03446394b3",
        "email": "agent@bankonnect.link",
        "profile_picture": "https:bankonnect.link/pic.png",
        "rating": "5.0",
        "status": "Inactive",
        "calls": 20
      },
      {
        "agent_id": "asd2112edas-7asdasd410-4c71-8975-nadsydn98as7d9as",
        "super_id": "daslmlad89-844f-41asd6c-8159-dkhnasdhais",
        "name": "Peter Parker",
        "password": "ud9asnud9asmdjkjd",
        "email": "agent@bankonnect.link",
        "profile_picture": "https:bankonnect.link/pic.png",
        "rating": "4.0",
        "status": "Active",
        "calls": 10
      }
    ],
    "managers": [
      {
        "manager_id": "122asdasada-84123das4f-41sadas6c-8asd159-893asdasfas221da0145",
        "manager_name": "Marc Spector",
        "password": "cdc604359845df597522b5caad1af29487fb98ea9faaad3b64c41a03446394b3",
        "email": "manager@bankonnect.link",
        "profile_picture": "https:bankonnect.link/pic.png",
        "is_quality": true
      },
      {
        "manager_id": "asdasd78asd9-ihnadsy832-dinhasy832-8asd159-infhabt8y2f",
        "manager_name": "Steven Grant",
        "password": "n9yx3cye9awmiuomjcqw9hdoadsa2sjoidunwqo",
        "email": "manager@bankonnect.link",
        "profile_picture": "https:bankonnect.link/pic.png",
        "is_quality": false
      }
    ]
  }
  ```
- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

# 3. ClientController.ts

## 3.1 Register a client

This route is used to register a client on the system.

- **Endpoint**: `/client/clientRegister`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "client_name": "Aunt May",
    "password": "My_P4ssw0rD!",
    "email": "client@email.com",
    "phone_number": "+525516768922",
    "client_pin": "3312"
  }
  ```
- **Validations**:
  | Field        | Validation                               |
  | ------------ | ---------------------------------------- |
  | client_name  | Must be a string                         |
  | client_name  | Must be between 2 and 40 characters long |
  | password     | Password must be a string                |
  | password     | Must be at least 8 characters long       |
  | email        | Must be a valid email                    |
  | phone_number | Must be a string                         |
  | phone_number | Must be a valid phone number             |
  | client_pin   | Must be a string                         |
  | client_pin   | Pin must be only 4 characters long       |
  | Access token             | Not required                       |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code    | Message                                  | Http |
  | ------- | ---------------------------------------- | ---- |
  | _No code_ | An account with Must be a valid email    | 422  |
  | _No code_ | Validation error                         | 500  |
  | _No code_ | Pin must be only 4 characters long       | 422  |
  | _No code_ | Must be between 2 and 40 characters long | 422  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Client registered",
    "body": {
      "client_id": "1jlk432l4k2ml1-1lk24jl124-12j43k12312-1312",
      "client_name": "Aunt May",
      "password": "p28m9oc0wnyr9ciomwqemc3r9ifou",
      "email": "client@email.com",
      "phone_number": "+526789096711",
      "client_pin": "fnosmcnuewocj"
    }
  }
  ```
- **If an error occurs**: `HTTP status 500` or `HTTP status 422`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

# 4. KeyClickController.ts

## 4.1 Add a keystroke done by an agent

Adds a recorded keystroke to an S3 bucket and stores it in the table KeyClickRecording.

- **Endpoint**: `/keyclick/addKeyStroke`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "key": "h, e, arrowleft, l, l, o, arrowright",
    "agent_id": "9a0so2ps-os0p-peo2-po2p-udiekal2p39w"
  }
  ```
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | key                      | Must be a string                   |
  | agent_id                 | Must be a string                   |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                  | Message                                 | Http |
  | --------------------- | --------------------------------------- | ---- |
  | NoTokenFound          | The token is not present in the request | 500  |
  | InvalidTokenException | The token is no valid                   | 500  |
  | _No code_               | key must be a string                    | 422  |
  | _No code_               | agent_id must be a string               | 422  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "writing h, e, arrowleft, l, l, o, arrowright 9a0so2ps-os0p-peo2-po2p-udiekal2p39w on a document"
  }
  ```
- **If an error occurs**: `HTTP status 500` or `HTTP status 422`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 4.2 Add a click done by an agent

Adds a recorded click to an S3 bucket and stores it in the table KeyClickRecording.

- **Endpoint**: `/keyclick/addClick`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "button": "login, dashboard, respondcall",
    "agent_id": "9a0so2ps-os0p-peo2-po2p-udiekal2p39w"
  }
  ```
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | button                   | Must be a string                   |
  | agent_id                 | Must be a string                   |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                  | Message                                 | Http |
  | --------------------- | --------------------------------------- | ---- |
  | NoTokenFound          | The token is not present in the request | 500  |
  | InvalidTokenException | The token is no valid                   | 500  |
  | _No code_              | button must be a string                 | 422  |
  | _No code_               | agent_id must be a string               | 422  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "writing login, dashboard, respondcall 9a0so2ps-os0p-peo2-po2p-udiekal2p39w on a document"
  }
  ```
- **If an error occurs**: `HTTP status 500` or `HTTP status 422`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 4.3 Delete all the files created by the controller

Deletes all the files created locally when recording keys and clicks.

- **Endpoint**: `/keyclick/deleteObjects`
- **Method**: `GET`
- **Body**: Doesn't recieve a body because of `GET` method.
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | Administrator privileges required  |

- **Errors**:
  | Code                     | Message                                        | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | NoTokenFound             | The token is not present in the request        | 500  |
  | InvalidTokenException    | The token is no valid                          | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "All files deleted"
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

# 5. ManagerController.ts

## 5.1 List all agents in the system and its attributes
Route that returns a list of all the agents registered in our app.

- **Endpoint**: `/manager/agentList`
- **Method**: `GET`
- **Body**: Doesn't recieve a body because of `GET` method.
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | Administrator privileges required  |

- **Errors**:
  | Code                  | Message                                 | Http |
  | --------------------- | --------------------------------------- | ---- |
  | NoTokenFound          | The token is not present in the request | 500  |
  | InvalidTokenException | The token is no valid                   | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "agents": [
      {
        "agent_id": "k123k1j2-7410-4c71-8975-hj12jk3jl12k",
        "super_id": "213knl12-844f-416c-8159-n123klj1l241",
        "name": "Thor Odinson",
        "password": "cdc604359845df597522b5caad1af29487fb98ea9faaad3b64c41a03446394b3",
        "email": "agent@bankonnect.link",
        "profile_picture": "https:bankonnect.link/pic.png",
        "rating": "5.0",
        "status": "Inactive",
        "calls": 25
      },
      {
        "agent_id": "asd2112e-7asd-4c71-8975-nadsydn98as7",
        "super_id": "daslmlad-844f-41as-8159-dkhnasdhais0",
        "name": "Kamala Khan",
        "password": "ud9asnud9asmdjkjd",
        "email": "agent@bankonnect.link",
        "profile_picture": "https:bankonnect.link/pic.png",
        "rating": "4.0",
        "status": "Active",
        "calls": 10
      }
    ]
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```
## 5.2 Get agent profile
Route that returns the profile of an agent given his email as query parameter.

- **Endpoint**: `/manager/agentProfile`
- **Method**: `GET`
- **Body**: Doesn't receive a body because of `GET` method but receives a query parameter like this: `https://backend.bannkonect.link/agent/agentProfile?email=agent@bankonnect.link`.
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                  | Message                                                     | Http |
  | --------------------- | ----------------------------------------------------------- | ---- |
  | NoTokenFound          | The token is not present in the request                     | 500  |
  | InvalidTokenException | The token is no valid                                       | 500  |
  | _No code_               | "WHERE parameter \"email\" has invalid \"undefined\" value" | 500  |
  | _No code_               | No agent with email: agent@bankonnect.link found            | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "agent_id": "k123k1j2-7410-4c71-8975-hj12jk3jl12k",
    "super_id": "213knl12-844f-416c-8159-n123klj1l241",
    "name": "Bucky Barnes",
    "password": "cdc604359845df597522b5caad1af29487fb98ea9faaad3b64c41a03446394b3",
    "email": "agent@bankonnect.link",
    "profile_picture": "https:bankonnect.link/pic.png",
    "rating": "5.0",
    "status": "Inactive",
    "calls": 11
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```
## 5.3 Get manager profile
Route that returns a manager profile using his email given as a query parameter.

- **Endpoint**: `/manager/managerProfile`
- **Method**: `GET`
- **Body**: Doesn't receive a body because of `GET` method but receives a query parameter like this: `https://backend.bannkonect.link/agent/agentProfile?email=manager_quality@bankonnect.link`.
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                  | Message                                                     | Http |
  | --------------------- | ----------------------------------------------------------- | ---- |
  | NoTokenFound          | The token is not present in the request                     | 500  |
  | InvalidTokenException | The token is no valid                                       | 500  |
  | _No code_              | "WHERE parameter \"email\" has invalid \"undefined\" value" | 500  |
  | _No code_               | No manager with email: manager@bankonnect.link found        | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "manager_id": "k123k1j2-7410-4c71-8975-hj12jk3jl12k",
    "manager_name": "Stan Lee",
    "password": "cdc604359845df597522b5caad1af29487fb98ea9faaad3b64c41a03446394b3",
    "email": "agent@bankonnect.link",
    "profile_picture": "https:bankonnect.link/pic.png",
    "is_quality": 0
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 5.4 Show a specific recording
Route that specific recording using its id.

- **Endpoint**: `/manager/showRecording`
- **Method**: `GET`
- **Body**: Doesn't receive a body because of `GET` method but receives a query parameter like this: `https://backend.bannkonect.link/agent/agentProfile?recording_id=1ioslejw-oeul-02o5-0pp3-pdoel4ks0oe3`.
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                  | Message                                                                                                                        | Http |
  | --------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---- |
  | NoTokenFound          | The token is not present in the request                                                                                        | 500  |
  | InvalidTokenException | The token is no valid                                                                                                          | 500  |
  | _No code_               | Cannot read properties of undefined (reading 'attrs')                                                                          | 500  |
  | ValidationException   | Invalid KeyConditionExpression: An expression attribute value used in expression is not defined; attribute value: :RecordingId | 500  |
  | InvalidTokenException | The token is no valid                                                                                                          | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "agent_email": "agent@bankonnect.link",
    "recording": {
      "RecordingId": "lsolp3os-d0w9-8cmr-pl02-0d29cdi20d21",
      "agentId": "9sdanucm-lsod-3cds-amoc-d3cdasud09m8",
      "agentName": "Ben Reily",
      "disconnectTimestamp": "2022-01-04 19:01:00",
      "duration":"0:02:00",
      "initialTimestamp": "2022-08-04 18:59:00",
      "processedRecording": "https://final-recordings.s3.us-west-.amazonaws.com/videos/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.mp4",
      "recordingData": {
        "AgentInterruptions": 0,
        "CustomerInterruptions": 0,
        "GraphCustomerSentimentByQuarter": [
          -1.7,
          0,
          -2.5,
          -1.7
        ],
        "GraphCustomerSentimentOverall": {
          "MIXED": 0,
          "NEGATIVE": 33.3,
          "NEUTRAL": 66.6,
          "POSITIVE": 0
        },
        "NonTalkTimeSeconds": 0,
        "OverallAgentSentiment": 0,
        "OverallCustomerSentiment": -1.7
      },
      "tags": [
        "c-entire-call-negative"
      ],
      "thumbnail": "https://final-recordings.s3.us-west-.amazonaws.com/thumbnails/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.jpg",
      "videoRecording": "https://final-recordings.s3.us-west-.amazonaws.com/videos/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.mp4"
    }
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 5.5 Show recordings of an agent
Route that returns all the records of an agent given his email by query parameter.

- **Endpoint**: `/manager/agentRecordings`
- **Method**: `GET`
- **Body**: Doesn't receive a body because of `GET` method but receives a query parameter like this: `https://backend.bannkonect.link/agent/agentProfile?email=agent@bankonnect.link`.
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | Administrator privileges required  |

- **Errors**:
  | Code                    | Message                                                   | Http |
  | ----------------------- | --------------------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists            | 500  |
  | NoTokenFound            | The token is not present in the request                   | 500  |
  | InvalidTokenException   | The token is no valid                                     | 500  |
  | _No code_                 | Cannot read properties of undefined (reading 'agent_id')  | 500  |
  | _No code_                 | WHERE parameter \"email\" has invalid \"undefined\" value | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "agent_email": "agent@bankonnect.link",
    "recordings": [{
      "RecordingId": "olepsu10-d0w9-8cmr-1q02-0d29cdi20d21",
      "agentId": "9sdanucm-l1od-3cds-amoc-d3cdasud09mp",
      "agentName": "Nick Fury",
      "tags": [
        "c-entire-call-negative"
      ],
      "thumbnail": "https://final-recordings.s3.us-west-.amazonaws.com/thumbnails/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.jpg",
    },
    {
     "RecordingId": "ole3401alwer-d0w9-8cmr-wa02-0d29cdi20d21",
      "agentId": "9sdanucm-l1od-3cds-amoc-d3cdasud09mp",
      "agentName": "Nick Fury",
      "tags": [
        "c-entire-call-negative", "problem-not-solved"
      ],
      "thumbnail": "https://final-recordings.s3.us-west-.amazonaws.com/thumbnails/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.jpg", 
    }]
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 5.6 Show recordings filtered by tags
Returns a list of video attributes filtered by an array of tags given.

- **Endpoint**: `/manager/filterRecordings`
- **Method**: `POST`
- **Body**: 
- ```json
  {
    "tags": ["card-declined", "problem-solved"]
  }
  ```
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | tags                     | Tags must be an array              |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                    | Message                                        | Http |
  | ----------------------- | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500  |
  | NoTokenFound            | The token is not present in the request        | 500  |
  | InvalidTokenException   | The token is no valid                          | 500  |
  | _No code_                 | Tags must be an array                          | 422  |

- **Response**: `HTTP status 200`
  ```json
  {
    "recordings": [{
      "RecordingId": "olepsu10-d0w9-8cmr-1q02-0d29cdi20d21",
      "agentId": "9sdanucm-l1od-3cds-amoc-d3cdasud09mp",
      "agentName": "Sam Wilson",
      "tags": [
        "c-entire-call-negative"
      ],
      "thumbnail": "https://final-recordings.s3.us-west-.amazonaws.com/thumbnails/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.jpg",
    },
    {
     "RecordingId": "ole3401alwer-d0w9-8cmr-wa02-0d29cdi20d21",
      "agentId": "9sdanucm-l1od-3cds-amoc-d3cdasud09mp",
      "agentName": "Tony Stark",
      "tags": [
        "c-entire-call-negative", "problem-not-solved"
      ],
      "thumbnail": "https://final-recordings.s3.us-west-.amazonaws.com/thumbnails/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.jpg", 
    }]
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 5.7 Show newest recordings
Route that returns the last recordings made in ascendent or descendent order

- **Endpoint**: `/manager/showLastRecordings`
- **Method**: `POST`
- **Body**: 
- ```json
  {
    "order": "Order of the video list" // Could be ASC or DESC
  }
  ```
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                    | Message                                                              | Http |
  | ----------------------- | -------------------------------------------------------------------- | ---- |
  | NoTokenFound            | The token is not present in the request                              | 500  |
  | InvalidTokenException   | The token is no valid                                                | 500  |
  | _No code_                 | Unknown column 'Calls.date`Order of the video list' in 'order clause | 500  |
  | _No code_                 | Cannot read properties of undefined (reading '_modelAttribute')      | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "recordings": [{
      "RecordingId": "olepsu10-d0w9-8cmr-1q02-0d29cdi20d21",
      "agentId": "9sdanucm-l1od-3cds-amoc-d3cdasud09mp",
      "agentName": "Reed Richards",
      "tags": [
        "c-entire-call-negative"
      ],
      "thumbnail": "https://final-recordings.s3.us-west-.amazonaws.com/thumbnails/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.jpg",
    },
    {
     "RecordingId": "ole3401alwer-d0w9-8cmr-wa02-0d29cdi20d21",
      "agentId": "9sdanucm-l1od-3cds-amoc-d3cdasud09mp",
      "agentName": "Sue Storm",
      "tags": [
        "c-entire-call-negative", "problem-not-solved"
      ],
      "thumbnail": "https://final-recordings.s3.us-west-.amazonaws.com/thumbnails/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.jpg", 
    }]
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 5.8 Show newest or oldest recordings
Route that returns a list of videos that match the given filters.

- **Endpoint**: `/manager/filterRecordingsByDate`
- **Method**: `GET`
- **Body**: 
  ```json
  {
    "user_email": "agent@bankonnect.link",  //Optional
    "date": "2022-06-06"
  }
  ```
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | date                     | Must be a string                   |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                     | Message                                        | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException  | An account with the given email already exists | 500  |
  | InvalidPasswordException | Password did not conform with policy           | 500  |
  | NoTokenFound             | The token is not present in the request        | 500  |
  | InvalidTokenException    | The token is no valid                          | 500  |
  | _No code_                 | Date must be a string                          | 422  |
  | _No code_                  | Incorrect DATE value: 'Invalid date'           | 500  |

- **Response if filtered by email and date**: `HTTP status 200`
  ```json
  {
    "recordings": [{
      "RecordingId": "olepsu10-d0w9-8cmr-1q02-0d29cdi20d21",
      "agentId": "9sdanucm-l1od-3cds-amoc-d3cdasud09mp",
      "agentName": "Johnny Storm",
      "tags": [
        "c-entire-call-negative"
      ],
      "thumbnail": "https://final-recordings.s3.us-west-.amazonaws.com/thumbnails/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.jpg",
    },
    {
     "RecordingId": "ole3401alwer-d0w9-8cmr-wa02-0d29cdi20d21",
      "agentId": "9sdanucm-l1od-3cds-amoc-d3cdasud09mp",
      "agentName": "Ben Grimm",
      "tags": [
        "c-entire-call-negative", "problem-not-solved"
      ],
      "thumbnail": "https://final-recordings.s3.us-west-.amazonaws.com/thumbnails/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.jpg", 
    }]
  }
  ```
  - **Response if filtered only by date**: `HTTP status 200`
  ```json
  {
    "recordings": [{
      "RecordingId": "olepsu10-d0w9-8cmr-1q02-0d29cdi20d21",
      "agentId": "9sdanucm-l1od-3cds-amoc-d3cdasud09mp",
      "agentName": "Bruce Wayne",
      "tags": [
        "c-entire-call-negative"
      ],
      "thumbnail": "https://final-recordings.s3.us-west-.amazonaws.com/thumbnails/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.jpg",
    },
    {
     "RecordingId": "ole3401alwer-d0w9-8cmr-wa02-0d29cdi20d21",
      "agentId": "9sdanucm-l1od-3cds-amoc-d3cdasud09mp",
      "agentName": "Clint Barton",
      "tags": [
        "c-entire-call-negative", "problem-not-solved"
      ],
      "thumbnail": "https://final-recordings.s3.us-west-.amazonaws.com/thumbnails/Y93217E9DJUC2J-d0w98cmr02-0d29cdi20d2.jpg", 
    }]
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 5.9 Post comments to an agent
Route that lets managers post comments to agents.

- **Endpoint**: `/manager/postComment`
- **Method**: `POST`
- **Body**: 
- ```json
  {
    "super_id": "adiaynb3-8rnf-2ecf-fsdd-d2edw0p8621",
    "agent_email": "agent@bankonnect.link",
    "comment": "This is a super good comment!",
    "rating": 5
  }
  ```
- **Validations**:
  | Field       | Validation                                 |
  | ----------- | ------------------------------------------ |
  | super_id    | Must be a string                           |
  | agent_email | Must be a valid email                      |
  | comment     | Must be a string                           |
  | rating      | Rating must be numeric and between 1 and 5 |
  | Access token             | Required                                                        |
  | Administrator privileges | No administrator privileges needed                              |
  | Quality role             | It is required to be a quality agent in order to use this route |

- **Errors**:
  | Code                     | Message                                        | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | NoTokenFound             | The token is not present in the request        | 500  |
  | InvalidTokenException    | The token is no valid                          | 500  |
  | UserNotQualityException  | The logged account is not a quality agent      | 401  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Comment posted to agent@bankonnect.link"
  }
  ```
- **If an error occurs**: `HTTP status 500` or `HTTP status 401`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 5.10 Update manager's profile picture
Route that updates a manager's profile picture if needed.

- **Endpoint**: `/manager/updateProfilePicture`
- **Method**: `POST`
- **Body**: 
- ```json
  {
    "user_email": "agent@bankonnect.link",
    "profile_picture": "http://bankonnect.link/pic.png",
  }
  ```
- **Validations**:
  | Field           | Validation            |
  | --------------- | --------------------- |
  | user_email      | Must be a valid email |
  | profile_picture | Must be a string      |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                    | Message                                        | Http |
  | ----------------------- | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500  |
  | NoTokenFound            | The token is not present in the request        | 500  |
  | InvalidTokenException   | The token is no valid                          | 500  |
  | _No code_                 | user_email must be a valid email               | 422  |
  | _No code_                 | profile_picture must be a string"              | 422  |
  


- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Profile picture updated"
  }
  ```
- **If an error occurs**: `HTTP status 500` or `HTTP status 422`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```


# 6. ThirdPartyServicesController.ts

## 6.1 Ask for a Third Party Service
This route asks for a specified third-party service consutling AWS Lambda API Gateways.

- **Endpoint**: `/tps/askService`
- **Method**: `POST`
- **Body**:
  - **Body to ask an Uber service**:
  ```json
  {
    "service": "Uber",
    "service_data": {
      "client": "Stephen Strange",
      "email": "dr.strange@outlook.com",
      "cellphone": "+525569006900",
      "client_location": "Sanctum Sanctorum, 3rd Wall Avenue, New York",
      "destination": "Dark Dimension"
    },
    "call_id": "osio389w-o0eo-pol2-lse3-olesl38ueu21"
  }
  ```
  - **Body to ask an UberEats service**:
  ```json
  {
    "service": "UberEats",
    "service_data": {
      "client": "Kate Bishop",
      "email": "bishop_k4te@outlook.com",
      "cellphone": "+525500690069",
      "client_location": "New York",
      "order": {
        "water_bottle": {
          "price": 10,
          "quantity": 1
        },
        "chocolate_frogs": {
          "price": 25,
          "quantity": 2
        }
      }
    },
    "call_id": "osio389w-o0eo-pol2-lse3-olesl38ueu21"
  }
  ```
  - **Body to ask an Oxxo service**:
  ```json
  {
    "service": "Oxxo",
    "service_data": {
      "client": "T'Challa",
      "email":"wakanda4ever@outlook.com",
      "cellphone": "+525500690069",
      "client_location": "Wakanda",
      "quantity": 300,
      "account_number": "19847638"
    },
    "call_id": "osio389w-o0eo-pol2-lse3-olesl38ueu21"
  }
  ``` 
  - **Body to ask a report service**:
  ```json
  {
    "service": "Report",
    "service_data": {
      "client": "James Howlett",
      "email":"wolverine@outlook.com",
      "cellphone": "+525500690069",
      "client_location": "Xavier's Mansion",
      "client_location_reference": "Near the special kids school",
      "client_statement": "Someone took my wallet and hurt my friends"
    },
    "call_id": "osio389w-o0eo-pol2-lse3-olesl38ueu21"
  }
  ```
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | service                  | Must be a string                   |
  | service_data             | Must be a JSON object              |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                     | Message                                        | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | NoTokenFound             | The token is not present in the request        | 500  |
  | InvalidTokenException    | The token is no valid                          | 500  |

- **Response**: `HTTP status 200`
  - **Response when an Uber service was asked**:
  ```json
  {
    "message": "Service asked!",
    "body": {
      "client": "Stephen Strange",
      "client_email": "dr.strange@outlook.com",
      "client_cellphone": "+525569006900",
      "rider": "George Martin",
      "car": {
        "model": "Nissan Tsuru",
        "color": "White",
        "plate": "4WS-00-10"
      },
      "client_location": "Sanctum Sanctorum, 3rd Wall Avenue, New York",
      "destination": "Dark Dimension",
      "arrival_time": 9,
      "ride_time": 8,
      "url": "http://uber.example.link.com/ride",
      "timestamp": "2022-05-27 14:49:07.371129"
    }
  }
  ```
  - **Response when an UberEats service was asked**:
  ```json
  {
    "message": "Service asked!",
    "body": {
      "client": "Kate Bishop",
      "client_email": "bishop_k4te@outlook.com",
      "client_cellphone": "+525500690069",
      "client_location": "New York",
      "order": {
        "water_bottle": {
          "price": 10,
          "quantity": 1
        },
        "chocolate_frogs": {
          "price": 25,
          "quantity": 2
        }
      },
      "total": 60,
      "delivery_name": "George Martin",
      "delivery_time": 23,
      "timestamp": "2022-05-27 14:49:07.371129" 
    }
  }
  ```
  - **Response when an Oxxo service was asked**:
  ```json
  {
    "message": "Service asked!",
    "mody": {
      "client": "T'Challa",
      "client_email":"wakanda4ever@outlook.com",
      "cellphone": "+525500690069",
      "client_location": "Wakanda",
      "oxxo_address": {
        "street": "Oak street #99",
        "state": "Wakanda",
        "colony": "Wakanda Colony",
        "zip_code": 69420,
        "country": "Africa"
      },
      "quantity": 300,
      "account_number": "19847638",
      "reference": "123456",
      "security_token": "0043",
      "timestamp": "2022-05-27 14:49:07.371129"
    }
  }
  ``` 
  - **Response when a report service was asked**:
  ```json
  {
    "message": "Service asked!",
    "body": {
      "client": "James Howlett",
      "client_email":"wolverine@outlook.com",
      "client_cellphone": "+525500690069",
      "client_location": "Xavier's Mansion",
      "client_location_reference": "Near the special kids school",
      "client_statement": "Someone took my wallet and hurt my friends",
      "folio": "90oepl12-ope3-loe3-po45-095o43leop23",
      "timestamp": "2022-05-27 14:49:07.371129"
    }
  }
  ```

- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 6.2 Send Third Party Service via e-mail
Sends a third party service that was asked to the client via email.

- **Endpoint**: `/tps/sendService`
- **Method**: `POST`
- **Body**: 
  - **Body to send an Uber service**:
  ```json
  {
    "service": "Uber",
    "service_data": {
      "client": "Stephen Strange",
      "client_email": "dr.strange@outlook.com",
      "client_cellphone": "+525569006900",
      "rider": "George Martin",
      "car": {
        "model": "Nissan Tsuru",
        "color": "White",
        "plate": "4WS-00-10"
      },
      "client_location": "Sanctum Sanctorum, 3rd Wall Avenue, New York",
      "destination": "Dark Dimension",
      "arrival_time": 9,
      "ride_time": 8,
      "url": "http://uber.example.link.com/ride",
      "timestamp": "2022-05-27 14:49:07.371129"
    }
  }
  ```
  - **Body to send an UberEats service**:
  ```json
  {
    "service": "UberEats",
    "service_data": {
      "client": "Kate Bishop",
      "client_email": "bishop_k4te@outlook.com",
      "client_cellphone": "+525500690069",
      "client_location": "New York",
      "order": {
        "water_bottle": {
          "price": 10,
          "quantity": 1
        },
        "chocolate_frogs": {
          "price": 25,
          "quantity": 2
        }
      },
      "total": 60,
      "delivery_name": "George Martin",
      "delivery_time": 23,
      "timestamp": "2022-05-27 14:49:07.371129" 
    }
  }
  ```
  - **Body to send an Oxxo service**:
  ```json
  {
    "service": "Oxxo",
    "service_data": {
      "client": "T'Challa",
      "client_email":"wakanda4ever@outlook.com",
      "cellphone": "+525500690069",
      "client_location": "Wakanda",
      "oxxo_address": {
        "street": "Oak street #99",
        "state": "Wakanda",
        "colony": "Wakanda Colony",
        "zip_code": 69420,
        "country": "Africa"
      },
      "quantity": 300,
      "account_number": "19847638",
      "reference": "123456",
      "security_token": "0043",
      "timestamp": "2022-05-27 14:49:07.371129"
    }
  }
  ``` 
  - **Body to send a report service**:
  ```json
  {
    "service": "Report",
    "service_Data": {
      "client": "James Howlett",
      "client_email":"wolverine@outlook.com",
      "client_cellphone": "+525500690069",
      "client_location": "Xavier's Mansion",
      "client_location_reference": "Near the special kids school",
      "client_statement": "Someone took my wallet and hurt my friends",
      "folio": "90oepl12-ope3-loe3-po45-095o43leop23",
      "timestamp": "2022-05-27 14:49:07.371129"
    }
  }
  ```
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | service                  | Must be a string                   |
  | service_data             | Must be a JSON object              |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                     | Message                                        | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | NoTokenFound             | The token is not present in the request        | 500  |
  | InvalidTokenException    | The token is no valid                          | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Email sent!"
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

# 7. UserConfigurations.ts

## 7.1 Get user's configuration

Obtains the app configurations of a determined user.

- **Endpoint**: `/userConfig/getUserConfig`
- **Method**: `GET`
- **Body**: Doesn't recieve a body because of `GET` method but receives a query parameter like this: `https://backend.bankonnect.link/userConfig/getUserConfig?id=aisud293o-psop-03pe-8fi0-0d9eiru5peo2`.
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                     | Message                                        | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | NoTokenFound             | The token is not present in the request        | 500  |
  | InvalidTokenException    | The token is no valid                          | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "UserConfigId": "09sau2uw-odp3-o04o-0p5h-uhr3-0doeu483oep4",
    "userId": "aisud293o-psop-03pe-8fi0-0d9eiru5peo2",
    "language": "en", //Can be en(english), es(spanish), fr(french)
    "textSize": "small", //Can be small, medium, big
    "color": "light" //Can be dark, light, dark_protanopia, dark_deuteranopia, dark_tritanopia, dark_protanomaly, dark_deuteranomaly, dark_tritanomal
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 7.2 Update user's configuration

Updates the app configurations of a determined user.

- **Endpoint**: `/userConfig/updateUserConfig`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "user_id": "aisud293o-psop-03pe-8fi0-0d9eiru5peo2",
    "language": "es", //Can be en(english), es(spanish), fr(french),
    "text_size": "medium", //Can be small, medium, big
    "color": "dark" //Can be dark, light, dark_protanopia, dark_deuteranopia, dark_tritanopia, dark_protanomaly, dark_deuteranomaly, dark_tritanomal
  }
  ```
- **Validations**:
  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code                     | Message                                                | Http |
  | ------------------------ | ------------------------------------------------------ | ---- |
  | InvalidTokenException    | The token is no valid                                  | 500  |
  | NoTokenFound             | The token is not present in the request                | 500  |
  | _No code_                 | "Cannot read properties of undefined (reading 'attrs') | 500  |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "User aisud293o-psop-03pe-8fi0-0d9eiru5peo2 configurations updated"
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```