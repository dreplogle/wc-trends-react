const api_root = "http://localhost:4000/report/"

export function api_call(req, handler) {
    console.log(api_root + req);
    fetch(api_root + req)
    .then(res => res.json())
    .then(
        (res) => {
            console.log(res);
            handler(res);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
            console.log(error);
        }
    );
}

// export api_call;