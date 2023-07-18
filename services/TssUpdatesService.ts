const wpUrl = "https://tis-support.hee.nhs.uk/wp-json/wp/v2/posts?per_page=20";

export async function getWhatsNew() {
  return await fetch(wpUrl);
}
