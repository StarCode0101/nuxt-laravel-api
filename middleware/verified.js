export default ({app,redirect})=>{

        if(app.$auth.loggedIn){
            if(app.$auth.user.email_verified_at == null){
                redirect('api/verify ')
            }
        }
 }
