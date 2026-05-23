package ar.edu.unq.apuntar.model.material
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.Date


@Document(collection = "comments")
data class Comment(
    @Id val id: ObjectId = ObjectId(),
    val materialId: Long,  // FK lógica hacia PSQL
    val userId: Long,
    val text: String,
    val createdAt: Date = Date()
)