// Get name from query string

var injectName = () => {

  // Update name reference
  let index = location.href.lastIndexOf("?name=")
  let name = location.href.slice(index + 6)
  document.getElementById("name").innerHTML = name

  // Update link to ENS registration site
  index = name.lastIndexOf('.')
  name = name.substring(0, index)
  document.getElementById("link-to-ens").innerHTML = "https://registrar.ens.domains/#" + name
  document.getElementById("link-to-ens").href = "https://registrar.ens.domains/#" + name
}

injectName()
