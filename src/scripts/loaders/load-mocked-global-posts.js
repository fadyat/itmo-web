const mockedPosts = [
    {
        "author": "fadyat",
        "description": "golang client",
        "filename": "client.go",
        "content": "package main\n\nimport (\n    \"bufio\"\n    \"fmt\"\n    \"net/http\"\n)\n\nfunc main() {\n\n    resp, err := http.Get(\"https://gobyexample.com\")\n    if err != nil {\n        panic(err)\n    }\n    defer resp.Body.Close()\n\n    fmt.Println(\"Response status:\", resp.Status)\n\n    scanner := bufio.NewScanner(resp.Body)\n    for i := 0; scanner.Scan() && i < 5; i++ {\n        fmt.Println(scanner.Text())\n    }\n\n    if err := scanner.Err(); err != nil {\n        panic(err)\n    }\n}",
        "lastChange": "Sat, 05 Nov 2022 17:44:37 GMT"
    },
    {
        "author": "fadyat",
        "description": "python codick",
        "filename": "bebra.py",
        "content": "import bebrochka\n\ndef bebrocki_nuchnut():\n    print('smell some nice bebra')\n    for bebroow in range([1, 2, 3]):\n        gigachadick = tuple(['giga', 'aboba'])\n       \n    return gigachadick * 228\n\n\nif __name__ == '__main__':\n    print('okeeeeey, lets go!')\n    ",
        "lastChange": "Sat, 05 Nov 2022 17:42:30 GMT"
    },
    {
        "author": "fadyat",
        "description": "Some rust code",
        "filename": "awesome_rust.rs",
        "content": "#![crate_name = \"doc\"]\n\npub struct Person {\n    name: String,\n}\n\nimpl Person {\n    pub fn new(name: &str) -> Person {\n        Person {\n            name: name.to_string(),\n        }\n    }\n\n    pub fn hello(& self) {\n        println!(\"Hello, {}!\", self.name);\n    }\n}\n\nfn main() {\n    let john = Person::new(\"John\");\n\n    john.hello();\n}\n",
        "lastChange": "Sun, 06 Nov 2022 18:43:03 GMT"
    }
]

document.addEventListener('DOMContentLoaded', () => {
    const postsBlock = document.querySelector('.posts');
    mockedPosts.forEach((post) => {
        const postBlock = createPost(post);
        postsBlock.appendChild(postBlock);
    });
});