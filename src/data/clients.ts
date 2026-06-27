import data from "@/content/clients.json";

export type Client = {
  name: string;
  logo: string;
};

// Tolerate malformed content (e.g. a stray text entry) so the site still builds.
export const clients = (data as unknown[]).filter(
  (c): c is Client =>
    !!c && typeof c === "object" && typeof (c as Client).name === "string"
) as Client[];
