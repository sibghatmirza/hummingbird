import data from "@/content/clients.json";

export type Client = {
  name: string;
  logo: string;
};

export const clients = data as Client[];
