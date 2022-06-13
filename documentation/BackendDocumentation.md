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
  - [3.2 Log in a client](#32-log-in-a-client)

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
- **Body**: Doesn't receive a body because of `GET` method but receives a query parameter like this: `https://backtest.bannkonect.link/agent/agentProfile?email=agent@bankonnect.link`

- **Validations**: _No body validation needed_.
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | Access token | Required |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "agent_id": "asdasd-1323-asdgg-3f-3df4",
    "super_id": "lkjk3m3kl-3-342342fds-32fdsfwl",
    "name":  "Agent's name",
    "password": "MyP4ssw0rD!",
    "email": "agent@bankonnect.link",
    "profile_picture": "https://profile.com/picture.png",
    "rating" 4.8,
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
- **Body**: Doesn't receive a body because of `GET` method but receives a query parameter like this: `https://backtest.bankonnect.link/agent/getFeedback?email=agent@bankonnect.link`

- **Validations**: _No body validation needed_.

  | Field                    | Validation                         |
  | ------------------------ | ---------------------------------- |
  | Access token             | Required                           |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`

  ```json
  {
    "agent_name": "name@server.com",
    "agent_email": "MYP4sw4rd$",
    "comments": [
      {
        "comment_id": 203492,
        "super_id": "0asodsajdhda-213eqsdas-31231dsaa-aseds",
        "comment": "You can improve.",
        "rating": 3,
        "date": "2022-06-06 15:13:56"
      },
      {
        "comment_id": 203493,
        "super_id": "089alksajd80-2dasd22sdas-3dqweopaa-a331ds",
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
    "comment_id": "The id of the comment"
  }
  ```
- **Validations**:

  - **Body validations**
    | Field | Validation |
    | ---------- | --------------------------- |
    | comment_id | Comment ID must be a string |
  - **Other validations**
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | Access token | Required |
    | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Comment 123 has been updated"
  }
  ```
- **If an error occurs**: `HTTP status 500`

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

  - **Body validations**:
    | Field | Validation |
    | --------------- | --------------------- |
    | user_email | Must be a valid email |
    | profile_picture | Must be a string |
  - **Other validations**:
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | Access token | Required |
    | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Profile picture updated"
  }
  ```
- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 1.5 Update agent's status

This route is used to change the status of an agent when a call is active or when the agent is online or offline.

- **Endpoint**: `/agent/updateStatus`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "agent_id": "8sahdkqwlda-139lfkmslfs-232l-o80sdf",
    "status": "agent status" //Could be Active, Inactive or In-Call
  }
  ```
- **Validations**: _No body validation needed_.
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | Access token | Required |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

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

Route that lets an agent to sign up in our application

- **Endpoint**: `/auth/signupAgent`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "super_email": "super@bankonnect.link",
    "name": "Super name",
    "password": "My_P4ssw0rD!",
    "email": "agent@bankonnect.link",
    "phone_number": "+525516768922",
    "profile_picture": "https://bankonnect.link/pic.png"
  }
  ```
- **Validations**:

  - **Body validations:**
    | Field | Validation |
    | ------------ | ---------------------------------------- |
    | email | Must be a valid email address |
    | password | Must be a string |
    | password | Must be at least 8 characters long |
    | name | Must be a string |
    |name| Must be between 2 and 40 characters long|
    | super_email | Must be a valid email |  
    |profile_picture|Must be a string|
  - **Other validations:**
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | Access token | Not required |
    | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Agent signed up",
    "body": {
      "super_id": "1jlk432l4k2ml1-1lk24jl124-12j43k12312-1312",
      "name": "Agent name",
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

Route that lets a manager to sign up in our application

- **Endpoint**: `/auth/signupManager`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Manager's name",
    "password":"My_P4ssw0rD!",
    "email": "manager_or_quality@bankonnect.link",
    "role": true, // True for quality agents and false for admin only
    "phone_number": "+526781927877",
    "profile_picture": "https://bankonnect.link/pic.png"
  }
  ```
- **Validations**:

  - **Body validations:**
    | Field | Validation |
    | ------------ | ---------------------------------------- |
    | email | Must be a valid email address |
    | password | Must be a string |
    | password | Must be at least 8 characters long |
    | name | Must be a string |
    |name| Must be between 2 and 40 characters long|
    | role | Must be boolean |  
    |profile_picture|Must be a string|
  - **Other validations:**
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | Access token | Not required |
    | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Agent signed up",
    "body": {
      "super_id": "1jlk432l4k2ml1-1lk24jl124-12j43k12312-1312",
      "name": "Agent name",
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

## 2.3 Verify an account

Route that lets a manager to sign up in our application

- **Endpoint**: `/auth/verify`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Manager's name",
    "password":"My_P4ssw0rD!",
    "email": "manager_or_quality@bankonnect.link",
    "role": true, // True for quality agents and false for admin only
    "phone_number": "+526781927877",
    "profile_picture": "https://bankonnect.link/pic.png"
  }
  ```
- **Validations**:

  - **Body validations:**
    | Field | Validation |
    | ------------ | ---------------------------------------- |
    | email | Must be a valid email address |
    | password | Must be a string |
    | password | Must be at least 8 characters long |
    | name | Must be a string |
    |name| Must be between 2 and 40 characters long|
    | role | Must be boolean |  
    |profile_picture|Must be a string|
  - **Other validations:**
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | Access token | Not required |
    | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Agent signed up",
    "body": {
      "super_id": "1jlk432l4k2ml1-1lk24jl124-12j43k12312-1312",
      "name": "Agent name",
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

## 2.4 Sign in the application

Route that lets a user (agent, manager or quality analyst) to sign in our app

- **Endpoint**: `/auth/signin`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "manager_or_quality_or_agent@bankonnect.link",
    "password":"My_P4ssw0rD!"
  }
  ```
- **Validations**:

  - **Body validations:**
    | Field | Validation |
    | ------------ | ---------------------------------------- |
    | email | Must be a valid email address |
    | password | Must be a string |
    | password | Must be at least 8 characters long |
    | name | Must be a string |
    |name| Must be between 2 and 40 characters long|
    | super_email | Must be a valid email |  
    |profile_picture|Must be a string|
  - **Other validations:**
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | Access token | Not required |
    | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "AccessToken": "NUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRFDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGPSOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOINUC3Y4TOYEQWINPRFDVSHCNEFFVTHJCTRGDSJKGNDAN34YVRMOJ43HTVIU3DFVGCEFIMVUNYCGP SOGWIRFSIFJEIJCFDSIOVJOISDJFKODSJDVOCJFSDKOCFJOSDJVFNODSJOVNHRJCIMJHEOI",
    "ExpiresIn": 86400,
    "TokenType": "Bearer",
    "RefreshToken": "YTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8F",
    "IdToken": "YTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7D9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8FYTVBUHhiuayuysgAUTRSUYAVS6AYUVSTAYUDTIAUY2782YIUsaIUSYAIUSYAIUDBYIUAYSuiADBIUYAIUDybasiudybubasd89asDB89AS7BD9AF9dsayudbD897ABSSab89asiuHSAJBHFASF7YABS8F",
    "role": "Role"
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

Route that lets an agent to sign out from our app

- **Endpoint**: `/auth/signout`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "manager_or_quality@bankonnect.link"
  }
  ```
- **Validations**:

  - **Body validations:**
    | Field | Validation |
    | ------------ | ---------------------------------------- |
    | email | Must be a valid email|
  - **Other validations:**
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | Access token | Not required |
    | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "User agent_or_manager_or_quality@bankonnect.link signed out"
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

Route that sends an email to a user (agent, manager or quality analyst) if they forgot their password to reset it

- **Endpoint**: `/auth/forgotPassword`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "manager_or_quality_or_agent@bankonnect.link"
  }
  ```
- **Validations**:

  - **Body validations:**
    | Field | Validation |
    | ------------ | ---------------------------------------- |
    | email | Must be a valid email|
  - **Other validations:**
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | Access token | Not required |
    | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Password resetting email sent to manager_or_quality_or_agent@bankonnect.link"
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

Route that lets a user (agent, manager or quality analyst) to change and confirm their password using the code sent on an email

- **Endpoint**: `/auth/confirmPassword`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "manager_or_quality_or_agent@bankonnect.link",
    "confirmation_code":"12345",
    "password":"MyP4ssw0Rd!"
  }
  ```
- **Validations**:

  - **Body validations:**
    | Field | Validation |
    | ------------ | ---------------------------------------- |
    | email | Must be a valid email|
    |confirmation_code|Must be a string|
    |password|Must be a string|
    |password|Must be at least 8 characters|
  - **Other validations:**
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | Access token | Not required |
    | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

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
- **If an error occurs**: `HTTP status 500`

  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 2.8 Get active user's email

Route that return the active user's email address

- **Endpoint**: `/auth/getUserEmail`
- **Method**: `GET`
- **Body**: _No body needed_.
- **Validations**: _No body validations needed_.
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | Access token | Required |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

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

Route that sends an email to a user (agent, manager or quality analyst) if they forgot their password to reset it

- **Endpoint**: `/auth/readUsers`
- **Method**: `GET`
- **Body**: _No body needed_.
- **Validations**: _No body validations needed_.
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | Access token | Required |
  | Administrator privileges |Administrator privileges required |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "agents": [
      {
        "agent_id": "k123k1j23-7410-4c71-8975-hj12jk3jl12k",
        "super_id": "213knl12312ml-844f-416c-8159-n123klj1l241",
        "name": "Agent name",
        "password": "cdc604359845df597522b5caad1af29487fb98ea9faaad3b64c41a03446394b3",
        "email": "agent@bankonnect.link",
        "profile_picture": "https:bankonnect.link/pic.png",
        "rating": "5.0",
        "status": "Inactive",
        "calls": 0
      },
      {
        "agent_id": "asd2112edas-7asdasd410-4c71-8975-nadsydn98as7d9as",
        "super_id": "daslmlad89-844f-41asd6c-8159-dkhnasdhais",
        "name": "Agent name",
        "password": "ud9asnud9asmdjkjd",
        "email": "agent@bankonnect.link",
        "profile_picture": "https:bankonnect.link/pic.png",
        "rating": "4.0",
        "status": "Active",
        "calls": 0
      }
    ],
    "managers": [
      {
        "manager_id": "122asdasada-84123das4f-41sadas6c-8asd159-893asdasfas221da0145",
        "manager_name": "Manager name",
        "password": "cdc604359845df597522b5caad1af29487fb98ea9faaad3b64c41a03446394b3",
        "email": "manager@bankonnect.link",
        "profile_picture": "https:bankonnect.link/pic.png",
        "is_quality": true
      },
      {
        "manager_id": "asdasd78asd9-ihnadsy832-dinhasy832-8asd159-infhabt8y2f",
        "manager_name": "Manager name",
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
    "client_name": "Client name",
    "password": "My_P4ssw0rD!",
    "email": "client@email.com",
    "phone_number": "+525516768922",
    "client_pin": "3312"
  }
  ```
- **Validations**:

  - **Body validations:**
    | Field | Validation |
    | ------------ | ---------------------------------------- |
    | client_name | Must be a string |
    | client_name | Must be between 2 and 40 characters long |
    | password | Password must be a string |
    | password | Must be at least 8 characters long |
    | email | Must be a valid email |
    | phone_number | Must be a string |
    | phone_number | Must be a valid phone number |
    | client_pin | Must be a string |
    | client_pin | Pin must be only 4 characters long |
  - **Other validations:**
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | Access token | Not required |
    | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Client registered",
    "body": {
      "client_id": "1jlk432l4k2ml1-1lk24jl124-12j43k12312-1312",
      "client_name": "Client name",
      "password": "p28m9oc0wnyr9ciomwqemc3r9ifou",
      "email": "client@email.com",
      "phone_number": "+526789096711",
      "client_pin": "fnosmcnuewocj"
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

## 3.2 Log in a client

This route allows a client to log in to the system.

- **Endpoint**: `/client/clientLogin`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "client@email.com",
    "password": "MyP4ssW0Rd!" //Could be Active, Inactive or In-Call
  }
  ```
- **Validations**:

  - **Body validations**:
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | email | Must be a valid email |
    | password |Password must be a string|
  - **Other validations**:
    | Field | Validation |
    | ------------------------ | ---------------------------------- |
    | Access token | Not required |
    | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "Logged in",
    "body": {
      "client_id": "1jlk432l4k2ml1-1lk24jl124-12j43k12312-1312",
      "client_name": "Client name",
      "password": "p28m9oc0wnyr9ciomwqemc3r9ifou",
      "email": "client@email.com",
      "phone_number": "+526789096711",
      "client_pin": "fnosmcnuewocj"
    }
  }
  ```
- **If incorrect email or password**: `HTTP status 404`

  ```json
  {
    "message": "Incorrect email or password"
  }
  ```

- **If an error occurs**: `HTTP status 500`

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
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | key | Must be a string |
  | agent_id | Must be a string |
  | Access token | Required |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "writing h, e, arrowleft, l, l, o, arrowright 9a0so2ps-os0p-peo2-po2p-udiekal2p39w on a document"
  }
  ```
- **If an error occurs**: `HTTP status 500`
  ```json
  {
    "code": "Error code",
    "message": "Error message"
  }
  ```

## 4.2 Add a click done by an agent

Adds a recorded keystroke to an S3 bucket and stores it in the table KeyClickRecording.

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
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | button | Must be a string |
  | agent_id | Must be a string |
  | Access token | Required |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

- **Response**: `HTTP status 200`
  ```json
  {
    "message": "writing login, dashboard, respondcall 9a0so2ps-os0p-peo2-po2p-udiekal2p39w on a document"
  }
  ```
- **If an error occurs**: `HTTP status 500`
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
- **Body**: Doesn't recieve a body because of `GET` method
- **Validations**:
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | Access token | Required |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

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

## 5.2 Get agent profile

## 5.3 Get manager profile

## 5.4 Show a specific recording

## 5.5 Show recordings of an agent

## 5.6 Show recordings filtered by tags
Returns a list of video attributes filtered by an array of tags given.

- **Endpoint**: `/manager/gilterRecordings`
- **Method**: `POST`
- **Body**: 
- ```json
  {
    "tags": []
  }
  ```
- **Validations**:
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | Access token | Required |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

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

## 5.7 Show newest recordings

## 5.8 Show newest or oldest recordings

## 5.9 Post comments to an agent

## 5.10 Update manager's profile picture

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
      "client": "Harry Potter",
      "email": "potter_harry@outlook.com",
      "cellphone": "+525500690069",
      "client_location": "Hogwarts",
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
      "client": "Harry Potter",
      "email": "potter_harry@outlook.com",
      "cellphone": "+525500690069",
      "client_location": "Hogwarts",
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
- **Validations**:
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | Access token | Required |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

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

## 6.2 Send Third Party Service via e-mail
Obtains the app configurations of a determined user.

- **Endpoint**: `/userConfig/getUserConfig`
- **Method**: `GET`
- **Body**: Doesn't recieve a body because of `GET` method but receives a query parameter like this: `https://backtest.bankonnect.link/userConfig/getUserConfig?id=aisud293o-psop-03pe-8fi0-0d9eiru5peo2`
- **Validations**:
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | Access token | Required |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

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

# 7. UserConfigurations.ts

## 7.1 Get user's configuration

Obtains the app configurations of a determined user.

- **Endpoint**: `/userConfig/getUserConfig`
- **Method**: `GET`
- **Body**: Doesn't recieve a body because of `GET` method but receives a query parameter like this: `https://backtest.bankonnect.link/userConfig/getUserConfig?id=aisud293o-psop-03pe-8fi0-0d9eiru5peo2`
- **Validations**:
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | Access token | Required |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

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

Obtains the app configurations of a determined user.

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
  | Field | Validation |
  | ------------------------ | ---------------------------------- |
  | Access token | Required |
  | Administrator privileges | No administrator privileges needed |

- **Errors**:
  | Code | Message | Http |
  | ------------------------ | ---------------------------------------------- | ---- |
  | UsernameExistsException | An account with the given email already exists | 500 |
  | InvalidPasswordException | Password did not conform with policy | 500 |
  | NoTokenFound | The token is not present in the request | 500 |

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