#clave el dev como default xq me parece lo mas comodo para ver ocmo levanta la aplicacion
dev: # para levantar la app y enganchar a los logs de la api d1
	docker compose up -d
	docker compose logs -f app
up:
	docker compose up -d

logs:
	docker compose logs -f app

logs-sql:
	docker compose logs -f sql_db

logs-nsql:
	docker compose logs -f nsql_db

down:
	docker compose down

clean: #para limpiar todos los volumenes si se rompio algo :(
	docker compose down -v