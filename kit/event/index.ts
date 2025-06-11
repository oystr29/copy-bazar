import { router } from "react-query-kit";
import { Axios } from "~/lib/axios";
import { Meta } from "../meta";

type Event = {
  id: number;
  uid: string;
  name: string;
  description: string;
  type: string;
  max_points: string;
  max_attempts: number;
  redirect_url: string;
  is_joined: boolean;
  users?:
    | {
        pivot: {
          user_id: number;
          is_allowed: number;
          attempt_count: number;
        };
      }[]
    | null;
};

const event = router("event", {
  all: router.query({
    fetcher: async () => {
      return {
        status: true,
        message: "berhasil",
        data: [
          {
            id: 1,
            uid: "TOKOBAZARQUIZ1",
            name: "QUIZ BERHADIAH POINT TOKO BAZAR",
            description: "JAWAB QUIZNYA DAN AMBIL POINTMU",
            type: "online",
            max_points: 20000,
            max_attempt: null,
            created_at: "2025-06-02T03:33:49.000000Z",
            updated_at: "2025-06-02T03:33:49.000000Z",
            redirect_url:
              "https://quiz-bazar.myevents.id?token=K7RZ7TAS2FXMQV8&id=4&event_id=1",
            is_joined: true,
            users: [
              {
                name: "Customer",
                email: "customer@gmail.com",
                pivot: {
                  is_allowed: true,
                  generated_token: "K7RZ7TAS2FXMQV8",
                  attempt_count: 0,
                  point_aqquired: "0",
                },
              },
            ],
            options: [],
          },
          {
            id: 2,
            uid: "LOMBAMAKANKERUPUK",
            name: "QUIZ BERHADIAH POINT TOKO BAZAR",
            description: "KERJAKAN QUESTNYA DI KOTAMU",
            type: "offline",
            max_points: 40000,
            max_attempt: null,
            created_at: "2025-06-02T03:33:49.000000Z",
            updated_at: "2025-06-02T03:33:49.000000Z",
            redirect_url: "?token=3RDX8Q45DAEYPJ6&id=4&event_id=2",
            is_joined: true,
            users: [
              {
                name: "Customer",
                email: "customer@gmail.com",
                pivot: {
                  is_allowed: true,
                  generated_token: "3RDX8Q45DAEYPJ6",
                  attempt_count: 0,
                  point_aqquired: "0",
                },
              },
            ],
            options: [
              {
                id: 1,
                event_id: 2,
                name: "PERINGKAT 1",
                points_aqquired: 40000,
                created_at: "2025-06-02T03:33:49.000000Z",
                updated_at: "2025-06-02T03:33:49.000000Z",
              },
              {
                id: 2,
                event_id: 2,
                name: "PERINGKAT 2",
                points_aqquired: 20000,
                created_at: "2025-06-02T03:33:49.000000Z",
                updated_at: "2025-06-02T03:33:49.000000Z",
              },
              {
                id: 3,
                event_id: 2,
                name: "PERINGKAT 3",
                points_aqquired: 10000,
                created_at: "2025-06-02T03:33:49.000000Z",
                updated_at: "2025-06-02T03:33:49.000000Z",
              },
            ],
          },
          {
            id: 3,
            uid: "MATHQUIZ",
            name: "Selesaikan Soal secepat mungkin untuk memperoleh point maksimal",
            description:
              "Selesaikan Soal secepat mungkin untuk memperoleh point maksimal",
            type: "online",
            max_points: 10000,
            max_attempt: null,
            created_at: "2025-06-02T07:23:53.000000Z",
            updated_at: "2025-06-04T03:01:45.000000Z",
            redirect_url:
              "https://games.myevents.id/math?token=Z35W4KG7QAF2NN6&id=4&event_id=3",
            is_joined: true,
            users: [
              {
                name: "Customer",
                email: "customer@gmail.com",
                pivot: {
                  is_allowed: true,
                  generated_token: "Z35W4KG7QAF2NN6",
                  attempt_count: 1,
                  point_aqquired: "1200",
                },
              },
            ],
            options: [],
          },
        ],
      };
    },
  }),
  single: router.query({
    fetcher: async (variables: { id: string | number }) => {
      return {} as {
        message: string;
        data: {
          event: Event;
          redirect_url: string;
        };
      };
    },
  }),
  join: router.mutation({
    mutationFn: async (variables: { id: string | number }) => {
      return {} as {
        message: string;
      };
    },
  }),
});

export { event };
