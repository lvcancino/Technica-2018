import numpy as np

# correct solution:
def softmax_loss(x):
    """Compute softmax values for each sets of scores in x."""
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=0) # only difference

def softmax_gd(X, y, Xt, yt, epochs=10, alpha = 0.5):
    Theta = np.zeros((y.shape[1],X.shape[1]+1))
    # Your implementation here.
    X = np.append(X, np.ones((X.shape[0], 1)), axis=1)
    Xt = np.append(Xt, np.ones((Xt.shape[0], 1)), axis=1)
    print("%10s | %10s | %10s | %10s" % \
    ("Test Err", "Train Err", "Test Loss", "Train Loss"))
    for i in range(epochs):
        yp = np.matmul(X, np.transpose(Theta))
        ytp = np.matmul(Xt, np.transpose(Theta))

        train_loss = 0
        test_loss = 0

        for j in range(yp.shape[0]):
            train_loss += 1.0/yp.shape[0] * softmax_loss(yp[j], y[j])[0]
        for j in range(ytp.shape[0]):
            test_loss += 1.0/ytp.shape[0] * softmax_loss(ytp[j], yt[j])[0]
        
        train_error = error(yp, y)
        test_error = error(ytp, yt)

        print("%10.4f | %10.4f | %10.4f | %10.4f" % \
            (test_error, train_error, test_loss, train_loss))
        batch_gradient = np.zeros(Theta.shape)

        for j in range(yp.shape[0]):
            _, gradient = softmax_loss(yp[j], y[j])
            batch_gradient += 1.0/yp.shape[0] * np.outer(gradient, X[j])
        Theta -= alpha * batch_gradient
    return Theta