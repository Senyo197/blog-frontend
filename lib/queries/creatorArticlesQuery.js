export default `
query CreatorArticles($status:[String]!, $pageSize: Int, $offset: Int) {
    creatorPosts(status: $status, pageSize:$pageSize, offset:$offset){
    posts{
      id
      slug
      type
      title
      draft_title
      date
      status
      excerpt
      tools
    }
    count
  }
}
`