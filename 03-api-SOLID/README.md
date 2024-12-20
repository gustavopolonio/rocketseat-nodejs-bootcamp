# App

Gympass style app


## Functional requirements

- [x] it should be possible to register itself
- [x] it should be possible to authenticate itself
- [x] it should be possible to get the profile of a logged in user
- [x] it should be possible to get the check-ins number of a logged in user
- [x] it should be possible the user gets his check-in history
- [x] it should be possible the user gets nearby gyms (<= 10km)
- [x] it should be possible the user gets gyms by name
- [x] it should be possible the user make check-in in a gym
- [x] it should be possible to validate the check-in of an user
- [x] it should be possible to register a gym


## Business rules

- [x] user can't register with a duplicated email
- [x] user can't do 2 check-ins in the same day
- [x] user can't do check-in if he isn't near (100m) from the gym
- [x] the check-in can only be validated up to 20 minutes after creation
- [x] the check-in can only be validated by admins
- [x] gym can only be registered by admins


## Non functional requirements

- [x] the user password must be encrypted
- [x] the app data must be in a PostgreSQL db
- [x] all data lists must be paginated with 20 items per page
- [x] user must be identified by a JWT (Json Web Token)
