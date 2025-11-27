const { join } = require("node:path");

const homeView = (req, res, next) => {
    try {
        const userActive = req.cookies.token;
        if (userActive) {
            return res.redirect("/dashboard");
        }
        const path = join(__dirname, "..", "views", "home.html");
        res.sendFile(path);
    } catch (error) {
        console.error("Error rendering the home view:", error);
        return next(error); 
    }
};

const dashboardView = (req, res, next) => {
    try {
        const userActive = req.cookies.token;
        if (userActive) {
            const path = join(__dirname, "..", "views", "dashboard.html");
            return res.sendFile(path);
        } else {
            return res.redirect("/");
        }
    } catch (error) {
        console.error("Error rendering the dashboard view:", error);
        return next(error); 
    }
};

const loginView = (req, res, next) => {
    try {
        const userActive = req.cookies.token;
        if (userActive) {
            return res.redirect("/dashboard");
        }
        const path = join(__dirname, "..", "views", "login.html");
        return res.sendFile(path);
    } catch (error) {
        console.error("Error rendering the login view:", error);
        return next(error);
    }
};

const registerView = (req, res, next) => {
    try {
        const userActive = req.cookies.token;
        if (userActive) {
            const path = join(__dirname, "..", "views", "dashboard.html");
            return res.sendFile(path);
        }
        const registerPath = join(__dirname, "..", "views", "register.html");
        return res.sendFile(registerPath);
    } catch (error) {
        console.error("Error rendering the register view:", error);
        return next(error); 
    }
};

module.exports = { homeView, dashboardView, loginView, registerView };
