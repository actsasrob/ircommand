export interface Environment  {
    production: boolean,
    apiUrl: ''| 'http://localhost:3000' | 'http://changeme:3000',
    anotherUrl: ''| 'http://another:8443'
}
