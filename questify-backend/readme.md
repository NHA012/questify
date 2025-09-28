Backend of Questify

1. create secret key for a service:
   kubectl create secret generic jwt-secret --from-literal JWT_KEY=asdf (only for local, key for prod is random)

2. add custom alias for local dev
   127.0.0.1 questify.dev

- path
  -- mac: /etc/hosts
  -- win: C:\Windows\System32\drivers\etc

3. Connect to db from terminal:
   kubectl port-forward svc/course-mgmt-postgres-srv 5432:5432

# After setting up port-forwarding

PGPASSWORD=CourseMgmtSecurePassword psql -h localhost -p 5432 -U postgres -d course_mgmt_ps_db
