package ar.edu.unq.apuntar.model.material
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.CompoundIndex
import org.springframework.data.mongodb.core.mapping.Document
import java.util.Date


@Document(collection = "reactions")
@CompoundIndex(def = "{'materialId': 1, 'userId': 1}", unique = true)
data class Reaction(
    @Id val id: ObjectId = ObjectId(),
    val materialId: Long,  // FK lógica hacia PSQL
    val userId: String?,
    val type: VoteType,
    val createdAt: Date = Date()
)