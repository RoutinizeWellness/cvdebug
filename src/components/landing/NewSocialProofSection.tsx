import { motion } from "framer-motion";

export function NewSocialProofSection() {
  const companies = [
    {
      name: "Google",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaoKTnNDmSIsQj8yPbOBpzM6hhAJLYOlsTbVLbY7_qjk31k5svTONvGZvYQ6eNBMiYodJC0aM9-4Syb9dRYyWkTxvcTvQ46p_7bmn1_7HEQPFH8V-wRD3x4KtD6-dvNy0ecpfkZ69lYtxT0ynA61ImfFdYVKsL4KmddgWapZg9Ld9C666NOSkp7jNOhAmpJeoxh8hBSMevl8opyLVvo40_KnUSK-61Q03OMhgL8FlguroRiOgw8sYxgsQu4YUvIJX6NVEy9sfEIw",
    },
    {
      name: "Amazon",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdH0nj4jFe9vc_RyUSNxlgdRkVMGRn9KWxsT8SJ2kfySUOWID-Rvr9LOX1PWAwtoFfPasvIaPgdtF5wS_NOZwP540ZlZ-EOIsjVjiSwLGbDtUxdyDZ_zBel-IGR0Y9OavmpS--KWVrartOCuVur0LDKwGBmYSuQ8VNXSmLiSL3usBfwIZb3akSFt-jN5i9eXyRdPb194khI8X8C3aH18a5snx6gQu3MGpv4MWOzRj6IqPw-LkbsTrUaQ9kNq6qXxiqV8rlxi4ePQ",
    },
    {
      name: "Meta",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0dTWCfWsEunVMr7sKzJXqR9wTpM8f42ps0H_oPNNmLxb_SX6NsnX7iX5JfK4Xsm6ZdGeRNwDZuCsYUoTM39i5Vn03_HDbXfeGc9zcs_KK8NhlykMDjP2fgB3SCrMh-k-pOHLxRLajLK9u-_l89Py6k3p02iw_yC4tTXL2kB3OM33ZnVbdUTLbHI72EzkHheNN23Fmptfmj5zptYBqPHpdBHgkAIqPuWHcz-qZ9_nFOiJoN2SIcehTWjFMbfZL9tqYziCnNh8WeA",
    },
    {
      name: "Slack",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbScCGCgB6OMkKyLk4m4sZGqqbGm3wEIJ3ClDWd4P8GmO97sW6jRx6N5p059tKq0LUFiSLjjddWQbkN_egu87xA-YHxkeouZU2AA1sl-znyKZWHTdKz2xdw9KKts48bpdlugRA-WzjAQy5xEmbl-dZo2-eFkpZknV6PxQqbJnM3fQyInYfa0UNbAPCBrOwPUmasq8jVmHeJ-NiiJBL8ijZ511R8jOxxUvqTH2WKbVyxa0S_GaMljl7_yNR3DkuV9IAZF3QwFM-Rg",
    },
    {
      name: "Microsoft",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPNpWchoPej87t0uRNISaQ41OvTdSMRrSLi55x5wGm-L-pCOgrCNUNhDYlFuo7k9iZGiJrQrn_6eSBWGQmzuh-_D8c4G-5x2ACtez_MUifguitfG6LhJkJiUU43z7rRqvylzr8ryM1kStyNWDhMk9GUrTIkTaS3dXWxGeCpaygzcmzGpyZW3oRLvn9i6_3NFUSlsoiYNJ0g2tJ6eYjTFLKM04K6Zst9LuXjicmoUeThWeaXosmU_s5OoRRxkgUSgbC39LyP5kG_Q",
    },
  ];

  return (
    <section className="border-y border-white/5 bg-slate-900/30 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium text-slate-500 mb-6"
        >
          Trusted by 150+ job seekers who landed offers at
        </motion.p>
        <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {companies.map((company, index) => (
            <motion.img
              key={company.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.5, scale: 1 }}
              whileHover={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              alt={company.name}
              className="col-span-2 max-h-8 w-full object-contain object-center lg:col-span-1 grayscale hover:grayscale-0 transition-all cursor-pointer"
              height={48}
              src={company.logo}
              width={158}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
