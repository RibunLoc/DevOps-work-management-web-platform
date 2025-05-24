
function generateUserId(context, events, done) {
    const userId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    context.vars.userId = userId;
    done();
}


function generateEmail(context, events, done) {
    const email = `user_${Date.now()}@example.com`;
    context.vars.email = email;
    console.log("Generated context.vars.email :", context.vars.email);
    console.log("Generated email :", email);
    done();
}

function generateTargetEmail(context, events, done) {
    const targetEmail = `user_${Date.now()}@example.com`;
    context.vars.targetEmail = targetEmail;
    done();
}



function generateTargetId(context, events, done) {
    const targetId = `target_${Math.floor(Math.random() * 1000)}`;
    context.vars.targetId = targetId;
    done();
}


function generatePostId(context, events, done) {
    const postId = `post_${Math.floor(Math.random() * 10000)}`;
    context.vars.postId = postId;
    done();
}


function generateCommentId(context, events, done) {
    const commentId = `comment_${Math.floor(Math.random() * 10000)}`;
    context.vars.commentId = commentId;
    done();
}

function generatePhoneNumber(context, events, done) {
    const phoneNumber = Math.floor(100000000 + Math.random() * 900000000).toString();
    context.vars.phoneNumber = phoneNumber;
    done();
}


module.exports = {
    generateCommentId,
    generateEmail,
    generatePhoneNumber,
    generatePostId,
    generateTargetEmail,
    generateTargetId,
    generateUserId
}