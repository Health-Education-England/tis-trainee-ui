const wpUrl =
  "https://tis-support.hee.nhs.uk/wp-json/wp/v2/posts?categories=19&orderby=date&status=publish&per_page=1";

export async function getWhatsNew() {
  return await fetch(wpUrl);
}
