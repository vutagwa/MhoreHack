import Principal "mo:base/Principal";
module myModule {

  type User = {
    userID: Nat;
    email: Text;
    password: Text;
  };
  type Content = {
  id : Nat;
  uploader : Principal.Principal;
  title : Text;
  ageRestrict : Nat; 
};
type Subscription = {
  userId : Text;
  status : Text;
  plan : Text;  
};

  var users : [User] = [];

  public func createUser(email: Text, password: Text) : async Result {
    let userExists = Array.exists(users, func(u) { u.email == email });
    if (userExists) {
      return Result.Error("User already exists");
    } else {
      let newUser = { userID = Array.length(users) + 1; email; password };
      users := Array.append(users, [newUser]);
      return Result.Ok("User created successfully");
    }
  };

  public func authenticateUser(email: Text, password: Text) : async Result {
    let user = Array.find(users, func(u) { u.email == email });
    switch (user) {
      case (?u) {
        if (u.password == password) {
          return Result.Ok(u.userID);
        } else {
          return Result.Error("Incorrect password");
        }
      };
      case null {
        return Result.Error("User not found");
      }
    }
  };

  public func updateUser(userID: Nat, email: Text, password: Text) : async Result {
    let index = Array.findIndex(users, func(u) { u.userID == userID });
    if (index >= 0) {
      users[index].email := email;
      users[index].password := password;
      return Result.Ok("User updated successfully");
    } else {
      return Result.Error("User not found");
    }
  };

  public func deleteUser(userID: Nat) : async Result {
    let index = Array.findIndex(users, func(u) { u.userID == userID });
    if (index >= 0) {
      users := Array.remove(users, index);
      return Result.Ok("User deleted successfully");
    } else {
      return Result.Error("User not found");
    }
  };

  actor class ContentManager {

  var contents : [Content] = [];
  var nextId : Nat = 0;

  // upload content
  public shared({caller}) func uploadContent(title : Text, ageRestriction : Nat) : async Nat {
    let content : Content = {
      id = nextId;
      uploader = caller;
      title = title;
      ageRestriction = ageRestriction;
    };
    nextId += 1;
    contents := contents # [content];
    return content.id;
  };

  // delete content
  public shared({caller}) func deleteContent(id : Nat) : async Bool {
    if let index = Array.findIndex((c) => c.id == id, contents) then {
      if (contents[index].uploader == caller) {
        contents := Array.remove(index, contents);
        return true;
      } else {
        return false; 
      }
    } else {
      return false; 
    }
  };

  // check age restriction of content
  public shared({caller}) func checkAgeRestriction(id : Nat, userAge : Nat) : async Bool {
    if let index = Array.findIndex((c) => c.id == id, contents) then {
      return userAge >= contents[index].ageRestriction;
    } else {
      return false; 
    }
  };
};
service : {
  //check subscription status
  public checkSubscription : (userId : Text) -> async Text;

  // process payment and update subscription status
  public processPayment : (userId : Text, paymentAmount : Nat) -> async Text;
} = actor {
  // Define a mutable map to store subscriptions
  var subscriptions : HashMap.Text<Subscription> = HashMap.empty;

  //check subscription status
  public func checkSubscription(userId : Text) : async Text {
    switch (HashMap.lookup(userId, subscriptions)) {
      | null => "No subscription found for this user"
      | some(subscription) => subscription.status
    }
  };

  // process payment and update subscription status
  public func processPayment(userId : Text, paymentAmount : Nat) : async Text {

    subscriptions := HashMap.update(userId, (subscription) => {
      status = "active";
      plan = "premium"; 
    }, subscriptions);
    "Payment processed successfully"
  };
};

};
